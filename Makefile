.PHONY: build dev-brain dev-merchant dev-dashboard proxy run

build:
	go build -o bin/crok ./cmd/crok

dev-brain:
	cd engine && npm run dev:brain

dev-merchant:
	cd engine && npm run dev:merchant

dev-dashboard:
	cd dashboard && npm run dev

build-dashboard:
	cd dashboard && npm run build

proxy:
	go run ./cmd/crok

# Example: make run CMD="curl http://localhost:4000/data"
run:
	go run ./cmd/crok run "$(CMD)"

install:
	cd engine && npm install
	cd dashboard && npm install
