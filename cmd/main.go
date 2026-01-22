package main

import (
	"fmt"
	"log"
	"net/http"
	"net/http/httputil"
	"net/url"
)

func main() {
	proxyPort := ":8080"
	fmt.Printf("🐊 CROKODILE Jaw (Go CLI) starting on %s...\n", proxyPort)

	http.HandleFunc("/", func(w http.ResponseWriter, r *http.Request) {
		// Log the intercepted request
		fmt.Printf("[JAW] Intercepted: %s %s\n", r.Method, r.URL.String())

		// In a real implementation, we would forward the request
		// and check for 402 Payment Required.
		
		// For now, this is a placeholder for the transparent proxy logic.
		w.Header().Set("X-Crokodile-Status", "Intercepted")
		w.WriteHeader(http.StatusOK)
		w.Write([]byte("Crokodile Jaw is snapping up requests!"))
	})

	log.Fatal(http.ListenAndServe(proxyPort, nil))
}

func handle402(target *url.URL) *httputil.ReverseProxy {
	return httputil.NewSingleHostReverseProxy(target)
}
