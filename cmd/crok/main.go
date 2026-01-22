package main

import (
	"flag"
	"fmt"
	"log"
	"os"
)

func main() {
	proxyPort := flag.String("port", ":8080", "Port to run the proxy on")
	engineURL := flag.String("engine", "http://localhost:3000", "URL of the Crokodile engine")
	flag.Parse()

	// Override with env vars if present
	if envPort := os.Getenv("CROKODILE_PROXY_PORT"); envPort != "" {
		*proxyPort = envPort
	}
	if envEngine := os.Getenv("CROKODILE_ENGINE_URL"); envEngine != "" {
		*engineURL = envEngine
	}

	engine := NewEngineClient(*engineURL)
	proxy := NewProxyServer(*proxyPort, engine)

	args := flag.Args()
	if len(args) > 0 && args[0] == "run" {
		if len(args) < 2 {
			fmt.Println("Usage: crok run \"<command>\"")
			os.Exit(1)
		}

		// Run proxy in background
		go func() {
			if err := proxy.Start(); err != nil {
				log.Fatalf("Proxy failed: %v", err)
			}
		}()

		// Run the command through the proxy
		err := RunWithProxy(args[1], *proxyPort)
		if err != nil {
			fmt.Printf("Command failed: %v\n", err)
			os.Exit(1)
		}
		return
	}

	// Default: just run the proxy
	if err := proxy.Start(); err != nil {
		log.Fatalf("Failed to start proxy: %v", err)
	}
}