package main

// AppConfig holds the configuration for the CROKODILE CLI
type AppConfig struct {
	ProxyPort      string
	EngineEndpoint string
	AgentID        string
}

// TransactionAudit represents a record of a 402 interception and settlement
type TransactionAudit struct {
	ID        string  `json:"id"`
	Merchant  string  `json:"merchant"`
	Amount    float64 `json:"amount"`
	Status    string  `json:"status"`
	Timestamp int64   `json:"timestamp"`
}
