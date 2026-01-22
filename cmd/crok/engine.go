package main

import (
	"bytes"
	"encoding/json"
	"fmt"
	"net/http"
	"time"
)

type EngineClient struct {
	Endpoint string
	Client   *http.Client
}

type PaymentPayload struct {
	AgentID   string  `json:"agentId"`
	Amount    float64 `json:"amount"`
	Merchant  string  `json:"merchant"`
	Currency  string  `json:"currency"`
	Reasoning string  `json:"reasoning"`
}

type PaymentResponse struct {
	Success      bool   `json:"success"`
	TxHash       string `json:"txHash"`
	PaymentProof string `json:"paymentProof"`
	Message      string `json:"message"`
}

func NewEngineClient(endpoint string) *EngineClient {
	return &EngineClient{
		Endpoint: endpoint,
		Client:   &http.Client{Timeout: 10 * time.Second},
	}
}

func (c *EngineClient) RequestPayment(payload PaymentPayload) (*PaymentResponse, error) {
	data, err := json.Marshal(payload)
	if err != nil {
		return nil, err
	}

	resp, err := c.Client.Post(c.Endpoint+"/pay", "application/json", bytes.NewBuffer(data))
	if err != nil {
		return nil, err
	}
	defer resp.Body.Close()

	if resp.StatusCode != http.StatusOK {
		var errResp map[string]interface{}
		json.NewDecoder(resp.Body).Decode(&errResp)
		return nil, fmt.Errorf("engine error: %v", errResp["message"])
	}

	var payResp PaymentResponse
	if err := json.NewDecoder(resp.Body).Decode(&payResp); err != nil {
		return nil, err
	}

	return &payResp, nil
}
