package main

import (
	"fmt"
	"io"
	"log"
	"net/http"
	"strings"
)

func main() {
	proxyPort := ":8080"
	fmt.Printf("🐊 CROKODILE Cmd (Go CLI) starting on %s...\n", proxyPort)

	handler := http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		if r.Method == http.MethodConnect {
			handleHTTPS(w, r)
			return
		}
		handleHTTP(w, r)
	})

	log.Fatal(http.ListenAndServe(proxyPort, handler))
}

func handleHTTP(w http.ResponseWriter, r *http.Request) {
	fmt.Printf("[CMD] Intercepted: %s %s\n", r.Method, r.URL.String())

	// Create a new request to the target
	outReq, err := http.NewRequest(r.Method, r.URL.String(), r.Body)
	if err != nil {
		http.Error(w, err.Error(), http.StatusInternalServerError)
		return
	}

	// Copy headers
	for k, v := range r.Header {
		outReq.Header[k] = v
	}

	// Execute the request
	client := &http.Client{}
	resp, err := client.Do(outReq)
	if err != nil {
		http.Error(w, err.Error(), http.StatusBadGateway)
		return
	}
	defer resp.Body.Close()

	// Check for 402 Payment Required
	if (resp.StatusCode == 402) {
		fmt.Printf("[CMD] ⚠️ 402 Payment Required detected from %s\n", r.URL.Host)
		paymentRequest := resp.Header.Get("X-402-Payment-Request")
		fmt.Printf("[CMD] Payment Request: %s\n", paymentRequest)
		
		// Call the Engine (Appwrite Function)
		fmt.Println("[CMD] 🧠 Consulting the Brain for payment authorization...")
		// In a real scenario, this would be an http.Post to the Appwrite function URL
		// For now, we simulate the handshake logic.
		fmt.Printf("[CMD] ✅ Brain approved transaction for %s. Injecting proof.\n", r.URL.Host)
		
		// In a real implementation:
		// 1. Send 402 details + agent reasoning to Appwrite
		// 2. Receive EIP-3009 proof
		// 3. Retry original request with Authorization: Bearer <proof>
	}

	// Copy response headers and body back to original requester
	for k, v := range resp.Header {
		w.Header()[k] = v
	}
	w.WriteHeader(resp.StatusCode)
	io.Copy(w, resp.Body)
}

func handleHTTPS(w http.ResponseWriter, r *http.Request) {
	// Simple HTTPS tunneling (CONNECT method)
	// Note: This won't allow inspecting traffic without MITM setup
	fmt.Printf("[CMD] Tunneling HTTPS: %s\n", r.Host)
	
	// This is a placeholder for actual MITM or simple tunneling
	http.Error(w, "HTTPS Interception requires MITM setup (CA certs)", http.StatusNotImplemented)
}