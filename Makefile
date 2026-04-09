# Makefile at root of project

# Build all Docker images
all: build up

# Build images
build:
	docker compose -f srcs/docker-compose.yml build

# Start containers
up:
	docker compose -f srcs/docker-compose.yml up -d

# Stop and remove containers
down:
	docker compose -f srcs/docker-compose.yml down

# Rebuild images and restart containers
re: down build up

# Clean volumes (optional)
clean:
	docker volume prune -f

.PHONY: all build up down re clean
