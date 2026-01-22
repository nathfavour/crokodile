package main

import (
	"fmt"
	"os"
	"os/exec"
	"os/signal"
	"syscall"
)

func RunWithProxy(command string, proxyPort string) error {
	fmt.Printf("[RUNNER] Starting command with proxy: %s\n", command)

	// Set environment variables for the child process to use the proxy
	// Most tools respect HTTP_PROXY and HTTPS_PROXY
	proxyURL := fmt.Sprintf("http://localhost%s", proxyPort)
	
	cmd := exec.Command("sh", "-c", command)
	cmd.Env = append(os.Environ(), 
		"HTTP_PROXY="+proxyURL,
		"HTTPS_PROXY="+proxyURL,
		"http_proxy="+proxyURL,
		"https_proxy="+proxyURL,
	)
	
	cmd.Stdout = os.Stdout
	cmd.Stderr = os.Stderr
	cmd.Stdin = os.Stdin

	// Handle signals to gracefully kill the child process
	sigChan := make(chan os.Signal, 1)
	signal.Notify(sigChan, os.Interrupt, syscall.SIGTERM)
	
	err := cmd.Start()
	if err != nil {
		return err
	}

	go func() {
		<-	sigChan
		cmd.Process.Kill()
	}()

	return cmd.Wait()
}
