#!/bin/bash

# Simple script to test the full flow
# Requires dev-brain and dev-merchant to be running

echo "🚀 Testing CROKODILE Snap Protocol..."
echo "-----------------------------------"

# Step 1: Normal request through proxy to mock merchant
# The proxy will detect 402, call the engine, get proof, and retry.
# We use -x to specify the proxy.
curl -s -x http://localhost:8080 http://localhost:4000/data | json_pp

echo "-----------------------------------"
echo "✅ Check the Dashboard and CLI logs for activity."
