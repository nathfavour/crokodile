# 🐊 CROKODILE | cronos-x402-v2.0.4-pro

> **Autonomous Machine-to-Machine (M2M) Payment Proxy & Ledger**

Crokodile is an Agentic Proxy ecosystem that enables AI agents to autonomously negotiate and settle `402 Payment Required` HTTP status codes. It bridges the gap between the value-locked web and autonomous compute.

![CROKODILE CLI](https://img.shields.io/badge/UI-BubbleTea-10b981?style=for-the-badge)
![Built with Go](https://img.shields.io/badge/Language-Go-00ADD8?style=for-the-badge&logo=go)
![Dashboard](https://img.shields.io/badge/Dashboard-Next.js-000000?style=for-the-badge&logo=next.js)

## 🏗️ Architecture

### 1. 🫦 The Jaw (Go CLI)
A high-performance transparent proxy built with **Go** and **Bubble Tea**.
- **TUI Dashboard**: Real-time visualization of intercepted 402 traffic.
- **Transparent Interception**: Respects `HTTP_PROXY` environment variables.
- **Auto-Negotiation**: Handshakes with the Brain to settle payments via EIP-3009.

### 2. 🧠 The Brain (Next.js API)
A centralized policy and settlement hub.
- **Reasoning Audit**: Uses **Gemini 1.5 Flash** to audit agent spending justifications.
- **Policy Enforcement**: Guardrails for daily budgets and per-request limits.
- **Gasless Settlement**: Simulation of EIP-3009 USDC transfers on Cronos.

### 3. 👁️ The Eye (MUI Dashboard)
A sleek, technical-premium monitoring interface at [crokodile-nathfavour02.vercel.app](https://crokodile-nathfavour02.vercel.app).

---

## 🚀 Quick Start

### Installation
Install the Crokodile Jaw CLI on your local node with a single command:
```bash
curl -sL https://crokodile.vercel.app/install.sh | sh
```

Alternatively, build from source:
```bash
make install
make build
```

### Running the CLI
Run the proxy and monitor traffic via the TUI:
```bash
./bin/crok
```

### Running an Agent Command
Run any command (like a Python agent or curl) through the Crokodile tunnel:
```bash
./bin/crok run "curl http://localhost:3000/api/mock-merchant"
```

---

## 🛠️ Development

- **Next.js App**: `cd dashboard && npm run dev`
- **Go CLI**: `make build`
- **Test End-to-End**: `./test-flow.sh`

---

## 🛡️ Security & Privacy
- **Isolation**: The CLI never sees your private keys; it only receives signed payment proofs from the Brain.
- **Auditability**: Every cent spent by an agent is backed by an AI-audited "Reasoning Trace."

© 2026 CROKODILE SECURE PROTOCOL • X402_COMPLIANT_NODE
