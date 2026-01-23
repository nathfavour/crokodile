.PHONY: build dev-dashboard build-dashboard proxy run install

build:
	go build -o bin/crok ./cmd/crok

dev-dashboard:
	cd dashboard && npm run dev

build-dashboard:
	cd dashboard && npm run build

proxy:
	go run ./cmd/crok/main.go ./cmd/crok/proxy.go ./cmd/crok/engine.go ./cmd/crok/runner.go ./cmd/crok/types.go

# Example: make run CMD="curl http://localhost:3000/api/mock-merchant"
run:
	go run ./cmd/crok/main.go ./cmd/crok/proxy.go ./cmd/crok/engine.go ./cmd/crok/runner.go ./cmd/crok/types.go run "$(CMD)"

install:
	cd dashboard && npm install