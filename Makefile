COMPOSE := docker compose
EXEC := docker exec

## Start and stop project ##
# Start and run the project
docker-start:
	docker start app-dev jet-centre-postgres-1 jet-centre-cache-1
dev:
	$(COMPOSE) -f docker-compose.dev.yml up --build
run-prod:
	$(COMPOSE) -f docker-compose.yml up -d

# Compile the images
build:
	$(COMPOSE) -f docker-compose.dev.yml build
build-prod:
	$(COMPOSE) -f docker-compose.yml build

# Stop Docker
stop:
	$(COMPOSE) stop

# Stop Docker and delete containers
down:
	$(COMPOSE) down
down-prod:
	$(COMPOSE) -f docker-compose.yml down


## Useful functions for dev ##
# Format code
fmt:
	$(EXEC) app-dev npm run fmt

# Open prisma studio (database debugging)
studio:
	$(EXEC) app-dev npx prisma studio


## Database setups ##
# Initialises the database
seed: reset_db
	$(EXEC) app-dev npx prisma db seed -- --environment dev
seed-prod: reset_db
	$(EXEC) app-dev npx prisma db seed -- --environment prod

# Updates the database without creating a migration
reset_db:
	$(EXEC) app-dev npx prisma db push --force-reset

# Updates the database and creates a migration
migrate:
	$(EXEC) app-dev npx prisma migrate deploy

.PHONY: build dev studio seed reset_db stop build-prod run-prod stop-prod
