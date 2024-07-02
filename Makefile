run-development-server:
	@echo "Running development server at http://localhost:3000"
	docker compose up -d && \
	docker compose exec app npm run migration:run

lint:
	@echo "Linting the code"
	docker compose exec app npm run lint

test-cov:
	@echo "Running tests with coverage"
	docker compose exec app npm run test:cov

test: dist/
	@echo "Running tests"
	docker compose exec app npm run test
