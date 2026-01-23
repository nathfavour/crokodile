package main

// AppConfig holds the configuration for the CROKODILE CLI
type AppConfig struct {
	ProxyPort      string
	EngineEndpoint string
	AgentID        string
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

// TransactionAudit represents a record of a 402 interception and settlement
type TransactionAudit struct {
	ID        string  `json:"id"`
	Merchant  string  `json:"merchant"`
	Amount    float64 `json:"amount"`
	Status    string  `json:"status"`
	Timestamp int64   `json:"timestamp"`
}