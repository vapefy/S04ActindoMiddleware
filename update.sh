#!/usr/bin/env bash
set -euo pipefail

# =============================================================================
# Update Script - Stage, Commit, and Push changes
# =============================================================================

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
cd "$SCRIPT_DIR"

usage() {
    echo "Usage: $0 -m \"commit message\""
    echo ""
    echo "Options:"
    echo "  -m, --message   Commit message (required)"
    echo "  -a, --amend     Amend last commit"
    echo "  -h, --help      Show this help"
    echo ""
    echo "Examples:"
    echo "  $0 -m \"fixed bug in login\""
    echo "  $0 --amend"
    exit 1
}

COMMIT_MSG=""
AMEND=false

# Parse arguments
while [[ $# -gt 0 ]]; do
    case "$1" in
        -m|--message)
            COMMIT_MSG="$2"
            shift 2
            ;;
        -a|--amend)
            AMEND=true
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

# Validate
if [[ "$AMEND" == false && -z "$COMMIT_MSG" ]]; then
    echo "Error: Commit message is required"
    echo ""
    usage
fi

# Show status
echo "Current changes:"
git status --short
echo ""

# Stage all changes
echo "[1/3] Staging changes..."
git add -A

# Commit
echo "[2/3] Committing..."
if [[ "$AMEND" == true ]]; then
    git commit --amend --no-edit
else
    git commit -m "$COMMIT_MSG"
fi

# Push
echo "[3/3] Pushing..."
git push

echo ""
echo "Done!"
