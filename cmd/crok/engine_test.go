package main

import (
	"encoding/json"
	"net/http"
	"net/http/httptest"
	"testing"
)

func TestEngineClient_RequestPayment(t *testing.T) {
	// Mock engine server
	server := httptest.NewServer(http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		if r.URL.Path != "/pay" {
			t.Errorf("expected to request /pay, got %s", r.URL.Path)
		}

		var payload PaymentPayload
		if err := json.NewDecoder(r.Body).Decode(&payload); err != nil {
			t.Fatal(err)
		}

		if payload.Amount != 0.01 {
			t.Errorf("expected amount 0.01, got %f", payload.Amount)
		}

		resp := PaymentResponse{
			Success:      true,
			TxHash:       "0x123",
			PaymentProof: "proof-abc",
			Message:      "Success",
		}
		w.Header().Set("Content-Type", "application/json")
		json.NewEncoder(w).Encode(resp)
	}))
	defer server.Close()

	client := NewEngineClient(server.URL)
	resp, err := client.RequestPayment(PaymentPayload{
		Amount:   0.01,
		Merchant: "test.com",
	})

	if err != nil {
		t.Fatalf("RequestPayment failed: %v", err)
	}

	if !resp.Success {
		t.Error("expected success true")
	}

	if resp.TxHash != "0x123" {
		t.Errorf("expected txHash 0x123, got %s", resp.TxHash)
	}
}
