COMPOSE := docker compose
EXEC := docker exec

APP_CONTAINER_NAME := jc-app
DB_CONTAINER_NAME := jc-postgres

APP_SERVICE_NAME := app
DB_SERVICE_NAME := postgres
STUDIO_SERVICE_NAME := studio

PREFIX := bun

DEV_COMPOSE := compose.yml

TMUX_SESSION := dev-logs

# Development
up:
	$(COMPOSE) -f $(DEV_COMPOSE) up -d

down:
	$(COMPOSE) -f $(DEV_COMPOSE) down

build:
	$(COMPOSE) -f $(DEV_COMPOSE) build

reload:
	$(COMPOSE) -f $(DEV_COMPOSE) restart $(APP_SERVICE_NAME)

install:
	$(EXEC) -it $(APP_CONTAINER_NAME) bun install --frozen-lockfile --verbose

restart: down up

logs:
	$(COMPOSE) -f $(DEV_COMPOSE) logs -f

slogs:
	tmux new-session -d -s $(TMUX_SESSION) -n logs "$(COMPOSE) -f $(DEV_COMPOSE) logs -f $(DB_SERVICE_NAME)"
	tmux split-window -v -t $(TMUX_SESSION):0 "$(COMPOSE) -f $(DEV_COMPOSE) logs -f $(APP_SERVICE_NAME)"
	tmux select-pane -t $(TMUX_SESSION):0.0
	tmux split-window -h -t $(TMUX_SESSION):0.0 "$(COMPOSE) -f $(DEV_COMPOSE) logs -f $(STUDIO_SERVICE_NAME)"
	tmux select-layout -t $(TMUX_SESSION):0 tiled
	tmux select-pane -t $(TMUX_SESSION):0.0
	tmux attach-session -t $(TMUX_SESSION)

# Database
generate:
	$(COMPOSE) -f $(DEV_COMPOSE) exec $(APP_SERVICE_NAME) $(PREFIX) run generate

reset-db:
	$(COMPOSE) -f $(DEV_COMPOSE) exec $(APP_SERVICE_NAME) $(PREFIX) run migrate:reset

migrate-db:
	$(COMPOSE) -f $(DEV_COMPOSE) exec $(APP_SERVICE_NAME) $(PREFIX) run migrate:dev

seed-db:
	$(COMPOSE) -f $(DEV_COMPOSE) exec $(APP_SERVICE_NAME) $(PREFIX) run db:seed:dev


.PHONY: up down build reload logs slogs reset-db migrate-db seed-db
