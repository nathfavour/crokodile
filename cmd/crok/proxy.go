package main

import (
	"bytes"
	"fmt"
	"io"
	"net/http"
	"net/url"
	"strconv"
	"strings"
	"time"
)

type ProxyServer struct {
	Port   string
	Engine *EngineClient
	Log    chan LogEntry
}

func NewProxyServer(port string, engine *EngineClient) *ProxyServer {
	return &ProxyServer{
		Port:   port,
		Engine: engine,
		Log:    make(chan LogEntry, 100),
	}
}

func (p *ProxyServer) Start() error {
	return http.ListenAndServe(p.Port, p)
}

func (p *ProxyServer) ServeHTTP(w http.ResponseWriter, r *http.Request) {
	if r.Method == http.MethodConnect {
		p.handleHTTPS(w, r)
		return
	}

	p.handleHTTP(w, r)
}

func (p *ProxyServer) handleHTTP(w http.ResponseWriter, r *http.Request) {
	entry := LogEntry{
		Timestamp: time.Now(),
		Method:    r.Method,
		URL:       r.URL.String(),
	}

	var bodyBytes []byte
	if r.Body != nil {
		var err error
		bodyBytes, err = io.ReadAll(r.Body)
		if err != nil {
			http.Error(w, err.Error(), http.StatusInternalServerError)
			return
		}
		r.Body.Close()
	}

	resp, err := p.performRequest(r, bodyBytes, "")
	if err != nil {
		http.Error(w, err.Error(), http.StatusBadGateway)
		return
	}
	defer resp.Body.Close()

	entry.Status = resp.StatusCode

	if resp.StatusCode == http.StatusPaymentRequired {
		amount := 0.01
		currency := "USDC"
		merchant := r.URL.Host
		agentID := "local-agent-001"
		reasoning := fmt.Sprintf("Automated payment for service at %s via Crokodile", r.URL.Host)

		if header := resp.Header.Get("X-402-Payment-Request"); header != "" {
			parts := strings.Split(header, ",")
			for _, part := range parts {
				kv := strings.Split(strings.TrimSpace(part), "=")
				if len(kv) == 2 {
					switch kv[0] {
					case "amount":
						if val, err := strconv.ParseFloat(kv[1], 64); err == nil {
							amount = val
						}
					case "currency":
						currency = kv[1]
					case "merchant":
						merchant = kv[1]
					}
				}
			}
		}

		payResp, err := p.Engine.RequestPayment(PaymentPayload{
			AgentID:   agentID,
			Amount:    amount,
			Merchant:  merchant,
			Currency:  currency,
			Reasoning: reasoning,
		})

		if err == nil {
			entry.Paid = true
			entry.Amount = amount
			retryResp, err := p.performRequest(r, bodyBytes, payResp.PaymentProof)
			if err == nil {
				defer retryResp.Body.Close()
				entry.Status = retryResp.StatusCode
				p.Log <- entry
				p.copyResponse(w, retryResp)
				return
			}
		}
	}

	p.Log <- entry
	p.copyResponse(w, resp)
}

func (p *ProxyServer) performRequest(r *http.Request, body []byte, proof string) (*http.Response, error) {
	targetURL := r.URL.String()
	if !strings.HasPrefix(targetURL, "http") {
		targetURL = "http://" + r.Host + r.URL.Path
		if r.URL.RawQuery != "" {
			targetURL += "?" + r.URL.RawQuery
		}
	}

	outReq, err := http.NewRequest(r.Method, targetURL, io.NopCloser(bytes.NewReader(body)))
	if err != nil {
		return nil, err
	}

	for k, v := range r.Header {
		outReq.Header[k] = v
	}

	if proof != "" {
		outReq.Header.Set("X-402-Payment-Proof", proof)
		outReq.Header.Set("Authorization", "Bearer "+proof)
	}

	client := &http.Client{}
	return client.Do(outReq)
}

func (p *ProxyServer) copyResponse(w http.ResponseWriter, resp *http.Response) {
	for k, v := range resp.Header {
		w.Header()[k] = v
	}
	w.WriteHeader(resp.StatusCode)
	io.Copy(w, resp.Body)
}

func (p *ProxyServer) handleHTTPS(w http.ResponseWriter, r *http.Request) {
	http.Error(w, "HTTPS MITM not implemented. Use HTTP for testing 402 interception.", http.StatusNotImplemented)
}
