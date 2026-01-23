package main

import "time"

// AppConfig holds the configuration for the CROKODILE CLI
type AppConfig struct {
	ProxyPort      string
	EngineEndpoint string
	AgentID        string
	AgentName      string
}

// PaymentPayload is the data sent to the engine to request a 402 settlement
type PaymentPayload struct {
	AgentID   string  `json:"agentId"`
	Amount    float64 `json:"amount"`
	Merchant  string  `json:"merchant"`
	Currency  string  `json:"currency"`
	Reasoning string  `json:"reasoning"`
}

// PaymentResponse is the data received from the engine after a settlement
type PaymentResponse struct {
	Success      bool   `json:"success"`
	TxHash       string `json:"txHash"`
	PaymentProof string `json:"paymentProof"`
	Message      string `json:"message"`
}

// RegisterPayload is used to register a new CLI agent with the Brain
type RegisterPayload struct {
	AgentID   string `json:"id"`
	AgentName string `json:"name"`
	Version   string `json:"version"`
}

// LogEntry represents an intercepted request for the TUI
type LogEntry struct {
	Timestamp time.Time
	Method    string
	URL       string
	Status    int
	Paid      bool
	Amount    float64
}
