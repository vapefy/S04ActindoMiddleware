#!/usr/bin/env bash
set -euo pipefail

usage() {
  echo "Usage: $0 -dev|-live"
  exit 1
}

if [[ $# -ne 1 ]]; then
  usage
fi

case "$1" in
  -dev)
    COMPOSE_FILE="compose.dev.yaml"
    ;;
  -live)
    COMPOSE_FILE="compose.yaml"
    ;;
  *)
    usage
    ;;
 esac

if [[ ! -f "$COMPOSE_FILE" ]]; then
  echo "Compose file not found: $COMPOSE_FILE"
  exit 1
fi

echo "[1/4] docker compose down ($COMPOSE_FILE)"
docker compose -f "$COMPOSE_FILE" down

echo "[2/4] git pull"
git pull

echo "[3/4] docker compose build ($COMPOSE_FILE)"
docker compose -f "$COMPOSE_FILE" build

echo "[4/4] docker compose up -d ($COMPOSE_FILE)"
docker compose -f "$COMPOSE_FILE" up -d

echo "Done."