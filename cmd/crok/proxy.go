package main

import (
	"bytes"
	"fmt"
	"io"
	"log"
	"net/http"
	"net/url"
	"strconv"
	"strings"
)

type ProxyServer struct {
	Port   string
	Engine *EngineClient
}

func NewProxyServer(port string, engine *EngineClient) *ProxyServer {
	return &ProxyServer{
		Port:   port,
		Engine: engine,
	}
}

func (p *ProxyServer) Start() error {
	fmt.Printf("🐊 CROKODILE Proxy active on %s\n", p.Port)
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

	log.Printf("[JAW] Intercepted: %s %s from %s", r.Method, r.URL.String(), r.RemoteAddr)



	// Buffer the body so we can read it multiple times (initial request + retry)

	var bodyBytes []byte

	if r.Body != nil {

		var err error

		bodyBytes, err = io.ReadAll(r.Body)

		if err != nil {

			log.Printf("[JAW] Error reading body: %v", err)

			http.Error(w, err.Error(), http.StatusInternalServerError)

			return

		}

		r.Body.Close()

	}



	// Perform the original request

	resp, err := p.performRequest(r, bodyBytes, "")

	if err != nil {

		log.Printf("[JAW] Error performing request: %v", err)

		http.Error(w, err.Error(), http.StatusBadGateway)

		return

	}

	defer resp.Body.Close()



		// If 402, negotiate payment



		if resp.StatusCode == http.StatusPaymentRequired {



			log.Printf("[JAW] ⚠️ 402 Detected from %s. Negotiating payment...", r.URL.Host)



	



					// Extract payment details from header if present



	



					// Spec v1.0: X-402-Payment-Request: amount=0.01, currency=USDC, merchant=domain.com



	



					amount := 0.01



	



					currency := "USDC"



	



					merchant := r.URL.Host



	



					agentID := "local-agent-001"



	



					reasoning := fmt.Sprintf("Automated payment for service at %s via Crokodile", r.URL.Host)



	



			



	



					if aID := r.Header.Get("X-Agent-ID"); aID != "" {



	



						agentID = aID



	



					}



	



					if intent := r.Header.Get("X-402-Intent"); intent != "" {



	



						reasoning = intent



	



					}



	



			



	



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



		if err != nil {

			log.Printf("[JAW] ❌ Payment negotiation failed: %v", err)

			p.copyResponse(w, resp)

			return

		}



		log.Printf("[JAW] ✅ Payment settled (TX: %s). Retrying request...", payResp.TxHash)



		// Retry with proof

		retryResp, err := p.performRequest(r, bodyBytes, payResp.PaymentProof)

		if err != nil {

			log.Printf("[JAW] Error retrying request: %v", err)

			http.Error(w, err.Error(), http.StatusBadGateway)

			return

		}

		defer retryResp.Body.Close()

		

		p.copyResponse(w, retryResp)

		return

	}



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



	// Copy original headers

	for k, v := range r.Header {

		outReq.Header[k] = v

	}



	// Inject payment proof if available

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
	// Simple CONNECT tunneling
	fmt.Printf("[JAW] Tunneling HTTPS to %s\n", r.Host)
	
	_, err := url.Parse("https://" + r.Host)
	if err != nil {
		http.Error(w, err.Error(), http.StatusBadRequest)
		return
	}

	// In a real robust implementation, we would hijack the connection here
	// and perform MITM with a trusted CA. For now, we just inform the user.
	http.Error(w, "HTTPS MITM not implemented. Use HTTP for testing 402 interception.", http.StatusNotImplemented)
}