#!/bin/bash

# Crokodile End-to-End Test Flow
# 🐊 This script demonstrates the 402 interception and negotiation flow.

echo "🚀 Starting Crokodile Test Flow..."

# 1. Build the CLI
echo "🛠️  Building Crokodile CLI..."
make build

# 2. Check if Next.js is running
echo "🔍 Checking for Crokodile Engine (Next.js)..."
if ! curl -s http://localhost:3000 > /dev/null; then
  echo "❌ Error: Next.js app is not running on http://localhost:3000"
  echo "   Please run 'make dev-dashboard' in another terminal first."
  exit 1
fi

# 3. Run a request through the proxy
echo "📡 Sending request to Mock Merchant via Crokodile Proxy..."
echo "--------------------------------------------------------"

./bin/crok run "curl -v http://localhost:3000/api/mock-merchant"

echo "--------------------------------------------------------"
echo "✅ Test Flow Complete."
echo "Check the Dashboard at http://localhost:3000 to see the settlement log."