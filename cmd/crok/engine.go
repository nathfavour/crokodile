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

func NewEngineClient(endpoint string) *EngineClient {
	return &EngineClient{
		Endpoint: endpoint,
		Client:   &http.Client{Timeout: 15 * time.Second},
	}
}

func (c *EngineClient) RequestPayment(payload PaymentPayload) (*PaymentResponse, error) {
	data, err := json.Marshal(payload)
	if err != nil {
		return nil, err
	}

	resp, err := c.Client.Post(c.Endpoint+"/api/pay", "application/json", bytes.NewBuffer(data))
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

func (c *EngineClient) Register(agentID, agentName, version string) error {
	payload := RegisterPayload{
		AgentID:   agentID,
		AgentName: agentName,
		Version:   version,
	}

	data, err := json.Marshal(payload)
	if err != nil {
		return err
	}

	resp, err := c.Client.Post(c.Endpoint+"/api/policies", "application/json", bytes.NewBuffer(data))
	if err != nil {
		return err
	}
	defer resp.Body.Close()

	if resp.StatusCode != http.StatusOK {
		return fmt.Errorf("registration failed with status: %d", resp.StatusCode)
	}

	return nil
}