run-development-server:
	@echo "Running development server at http://localhost:3000"
	docker compose up -d
	docker compose exec app npm run migration:run
