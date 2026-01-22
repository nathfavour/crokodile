.PHONY: build dev-brain dev-merchant dev-dashboard proxy run

build:
	cd cmd && go build -o ../bin/crok .

dev-brain:
	cd engine && npm run dev:brain

dev-merchant:
	cd engine && npm run dev:merchant

dev-dashboard:
	cd dashboard && npm run dev

proxy:
	cd cmd && go run .

# Example: make run CMD="curl http://localhost:4000/data"
run:
	cd cmd && go run . run "$(CMD)"

install:
	cd engine && npm install
	cd dashboard && npm install
