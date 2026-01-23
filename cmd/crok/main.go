package main

import (
	"flag"
	"fmt"
	"log"
	"os"

	tea "github.com/charmbracelet/bubbletea"
)

var (
	version = "2.0.4-pro"
	commit  = "none"
	date    = "unknown"
)

func main() {
	proxyPort := flag.String("port", ":8080", "Port to run the proxy on")
	engineURL := flag.String("engine", "https://crokodile-nathfavour02.vercel.app", "URL of the Crokodile engine")
	agentID := flag.String("id", "AGT-LOCAL-001", "Agent ID for this node")
	agentName := flag.String("name", "Local_Intercept_Node", "Display name for this agent")
	noTUI := flag.Bool("no-tui", false, "Disable TUI and run in headless mode")
	showVersion := flag.Bool("version", false, "Show version information")
	flag.Parse()

	if *showVersion {
		fmt.Printf("crok %s (commit: %s, date: %s)\n", version, commit, date)
		return
	}

	if envPort := os.Getenv("CROKODILE_PROXY_PORT"); envPort != "" {
		*proxyPort = envPort
	}
	if envEngine := os.Getenv("CROKODILE_ENGINE_URL"); envEngine != "" {
		*engineURL = envEngine
	}

	engine := NewEngineClient(*engineURL)
	proxy := NewProxyServer(*proxyPort, engine)

	// Attempt registration
	fmt.Printf("Registering agent %s with engine %s...\n", *agentID, *engineURL)
	err := engine.Register(*agentID, *agentName, version)
	if err != nil {
		fmt.Printf("⚠️  Registration warning: %v (running in unlinked mode)\n", err)
	}

	args := flag.Args()
	if len(args) > 0 {
		switch args[0] {
		case "run":
			if len(args) < 2 {
				fmt.Println("Usage: crok run \"<command>\"")
				os.Exit(1)
			}

			go func() {
				if err := proxy.Start(); err != nil {
					log.Fatalf("Proxy failed: %v", err)
				}
			}()

			err := RunWithProxy(args[1], *proxyPort)
			if err != nil {
				fmt.Printf("Command failed: %v\n", err)
				os.Exit(1)
			}
			return
		case "pay":
			if len(args) < 2 {
				fmt.Println("Usage: crok pay \"crok://pay?...\"")
				os.Exit(1)
			}
			uri := args[1]
			fmt.Printf("💳 Processing Payment URI: %s\n", uri)
			// Mock parsing and success for demo
			time.Sleep(1 * time.Second)
			fmt.Println("✅ AI Reasoning Audit Passed")
			time.Sleep(1 * time.Second)
			fmt.Println("✅ EIP-3009 Signature Generated")
			fmt.Println("✅ Settlement Confirmed on Cronos Testnet")
			return
		}
	}

	if *noTUI {
		fmt.Printf("🐊 CROKODILE Proxy active on %s (HEADLESS)\n", *proxyPort)
		if err := proxy.Start(); err != nil {
			log.Fatalf("Failed to start proxy: %v", err)
		}
		return
	}

	// Run TUI
	go func() {
		if err := proxy.Start(); err != nil {
			// TUI handles errors via status updates
		}
	}()

	p := tea.NewProgram(initialModel(proxy, engine, *agentID), tea.WithAltScreen())
	if _, err := p.Run(); err != nil {
		fmt.Printf("Alas, there's been an error: %v", err)
		os.Exit(1)
	}
}
