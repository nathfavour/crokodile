# Contributing to Crokodile 🐊

First off, thank you for considering contributing to **Crokodile**! We're building the first agentic proxy for the `402 Payment Required` ecosystem, and your help is vital.

We operate under a **Zero Friction Policy**. Whether it's a bug fix, documentation update, or a new engine feature, we value your progress and input over strict bureaucracy.

---

## 🏗️ Project Structure

Crokodile is a multi-component system:
- `cmd/crok/`: The Go-based transparent proxy (The Jaw).
- `engine/`: The TypeScript/Appwrite backend (The Brain).
- `dashboard/`: The Next.js monitoring interface (The Eye).

---

## 🛠️ Local Development

### 1. Prerequisites
- **Go** (1.25+)
- **Node.js** & **npm**
- **Docker** (optional, for Appwrite)

### 2. Setup
```bash
git clone https://github.com/nathfavour/crokodile.git
cd crokodile
make install
```

### 3. Running the Stack
Use the `Makefile` to launch components in separate terminals:
```bash
make dev-brain     # Start the Engine
make dev-merchant  # Start the Mock Merchant for testing
make build         # Build the CLI locally
```

---

## 🤝 How to Contribute

1.  **Fork the repository** and create your feature branch.
2.  **Make your changes.** Follow the existing style and ensure `go test ./cmd/crok/...` passes.
3.  **Submit a Pull Request.** Be clear about what you've changed and why.

---

## 🧠 Core Philosophy
- **Speed & Fluidity**: We prefer a working prototype over a perfect proposal.
- **System Intimacy**: The proxy should be transparent and lightweight.
- **Privacy First**: Never log sensitive payment proofs or headers.

## 📜 Code of Conduct
Be excellent to each other. Collaboration thrives on respect.

---

<div align="center">
  <sub>Built with 💜 for the future of agentic payments.</sub>
</div>
