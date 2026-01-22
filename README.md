# 🐊 CROKODILE

The Agentic x402 Proxy. Intercept 402s, negotiate gasless EIP-3009 payments, and retry requests transparently.

## Components

- **The Jaw (Go CLI):** Transparent proxy that intercepts traffic and retries 402s.
- **The Brain (Engine):** TypeScript/Appwrite backend that signs transactions and enforces policies.
- **The Eye (Dashboard):** Next.js dashboard for monitoring settlements.

## Quick Start

### 1. Install dependencies
```bash
make install
```

### 2. Start the Engine (The Brain)
```bash
make dev-brain
```

### 3. Start the Mock Merchant (For testing)
```bash
make dev-merchant
```

### 4. Run a command through Crokodile
In a new terminal:
```bash
make run CMD="curl http://localhost:4000/data"
```

You will see:
1. `curl` makes a request to the mock merchant.
2. Merchant returns `402 Payment Required`.
3. `crok` (The Jaw) intercepts this, calls the Engine (The Brain).
4. The Brain "signs" a transaction and returns a proof.
5. `crok` retries the original `curl` request with the proof.
6. `curl` receives `200 OK` with the secret data.

### 5. Open the Dashboard
```bash
make dev-dashboard
```
Visit `http://localhost:3001` (or the port Next.js assigned).

## Development

### Building the CLI
```bash
make build
```
The binary will be available at `./bin/crok`.

### Releases
Releases are handled automatically via GoReleaser and GitHub Actions when a new tag is pushed.
Supported platforms: Linux, Windows, macOS, and Android (arm/arm64).

```bash
git tag -a v0.1.0 -m "First release"
git push origin v0.1.0
```

## License
MIT
