#!/usr/bin/env bash
set -euo pipefail

# =============================================================================
# Deploy Script - Pull, Build, and Deploy with Docker Compose
# =============================================================================

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
cd "$SCRIPT_DIR"

usage() {
    echo "Usage: $0 [OPTIONS]"
    echo ""
    echo "Options:"
    echo "  -d, --dev       Use development configuration"
    echo "  -l, --live      Use production configuration (default)"
    echo "  -n, --no-pull   Skip git pull"
    echo "  -r, --restart   Only restart (no rebuild)"
    echo "  -h, --help      Show this help"
    echo ""
    echo "Examples:"
    echo "  $0              # Deploy production (pull + build + up)"
    echo "  $0 --dev        # Deploy development"
    echo "  $0 --restart    # Restart without rebuilding"
    exit 1
}

# Defaults
COMPOSE_FILE="compose.yaml"
ENV_NAME="production"
DO_PULL=true
DO_BUILD=true

# Parse arguments
while [[ $# -gt 0 ]]; do
    case "$1" in
        -d|--dev)
            COMPOSE_FILE="compose.dev.yaml"
            ENV_NAME="development"
            shift
            ;;
        -l|--live)
            COMPOSE_FILE="compose.yaml"
            ENV_NAME="production"
            shift
            ;;
        -n|--no-pull)
            DO_PULL=false
            shift
            ;;
        -r|--restart)
            DO_BUILD=false
            shift
            ;;
        -h|--help)
            usage
            ;;
        *)
            echo "Unknown option: $1"
            usage
            ;;
    esac
done

# Check compose file exists
if [[ ! -f "$COMPOSE_FILE" ]]; then
    echo "Error: Compose file not found: $COMPOSE_FILE"
    exit 1
fi

echo "============================================"
echo " Deploying: $ENV_NAME"
echo " Compose:   $COMPOSE_FILE"
echo "============================================"
echo ""

# Step 1: Stop containers
echo "[1/4] Stopping containers..."
docker compose -f "$COMPOSE_FILE" down

# Step 2: Git pull (optional)
if [[ "$DO_PULL" == true ]]; then
    echo "[2/4] Pulling latest changes..."
    git fetch && git reset --hard FETCH_HEAD
else
    echo "[2/4] Skipping git pull"
fi

# Step 3: Build (optional)
if [[ "$DO_BUILD" == true ]]; then
    echo "[3/4] Building containers..."
    docker compose -f "$COMPOSE_FILE" build --no-cache
else
    echo "[3/4] Skipping build"
fi

# Step 4: Start containers
echo "[4/4] Starting containers..."
docker compose -f "$COMPOSE_FILE" up -d

echo ""
echo "============================================"
echo " Deploy complete!"
echo " Logs: docker compose -f $COMPOSE_FILE logs -f"
echo "============================================"
