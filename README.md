# 🐊 CROKODILE

**The Agentic x402 Proxy.** Intercept `402 Payment Required`, negotiate gasless EIP-3009 payments, and retry requests transparently.

---

## 🛠️ Components

- **🦷 The Jaw (Go CLI):** Transparent proxy intercepting traffic and retrying 402s.
- **🧠 The Brain (Engine):** TS/Appwrite backend signing transactions & enforcing policies.
- **👁️ The Eye (Dashboard):** Next.js interface for monitoring automated settlements.

---

## 🚀 Quick Start

### 1. Installation
```bash
git clone https://github.com/nathfavour/crokodile.git
cd crokodile
make install
```

### 2. Launch Services
Start the **Brain** and **Mock Merchant** (separate terminals):
```bash
make dev-brain     # Engine (Port 3000)
make dev-merchant  # Test API (Port 4000)
```

### 3. Run the Proxy
Intercept any command (e.g., `curl`):
```bash
make run CMD="curl http://localhost:4000/data"
```

---

## 📦 Building from Source

Build the CLI binary for your local machine:
```bash
make build
# Binary created at ./bin/crok
```

### 📱 Cross-Platform Releases
Automated via GoReleaser. Supports **Linux, Windows, macOS, and Android**.

```bash
git tag -a v0.1.0 -m "Release message"
git push origin v0.1.0
```

---

## 📊 Monitoring
View real-time transaction activity:
```bash
make dev-dashboard
# Visit http://localhost:3001
```

---

## 📄 License
MIT © 2026 [nathfavour](https://github.com/nathfavour)