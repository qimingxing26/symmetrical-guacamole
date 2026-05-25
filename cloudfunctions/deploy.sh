#!/usr/bin/env bash
set -euo pipefail

SCRIPT_DIR="$(cd "$(dirname "$0")" && pwd)"
PROJECT_ROOT="$(cd "$SCRIPT_DIR/.." && pwd)"
ENV_FILE="$PROJECT_ROOT/.env.local"
JSON_FILE="$SCRIPT_DIR/cloudbaserc.json"
BACKUP_FILE="$JSON_FILE.bak"
TMP_FILE="$(mktemp)"

restore_config() {
  if [ -f "$BACKUP_FILE" ]; then
    mv "$BACKUP_FILE" "$JSON_FILE"
  fi
  if [ -f "$TMP_FILE" ]; then
    rm -f "$TMP_FILE"
  fi
}
trap restore_config EXIT

if [ ! -f "$ENV_FILE" ]; then
  echo "ERROR: .env.local not found. Copy .env.example to .env.local first."
  exit 1
fi

set -a
. "$ENV_FILE"
set +a

: "${ENV_ID:?ENV_ID is required}"
: "${ADMIN_USERNAME:?ADMIN_USERNAME is required}"
: "${ADMIN_PASSWORD:?ADMIN_PASSWORD is required}"
: "${ADMIN_TOKEN_SECRET:?ADMIN_TOKEN_SECRET is required}"

escape_sed() {
  printf '%s' "$1" | sed 's/[&|\\]/\\&/g'
}

sed \
  -e "s|{{ENV_ID}}|$(escape_sed "$ENV_ID")|g" \
  -e "s|{{ADMIN_USERNAME}}|$(escape_sed "$ADMIN_USERNAME")|g" \
  -e "s|{{ADMIN_PASSWORD}}|$(escape_sed "$ADMIN_PASSWORD")|g" \
  -e "s|{{ADMIN_TOKEN_SECRET}}|$(escape_sed "$ADMIN_TOKEN_SECRET")|g" \
  "$JSON_FILE" > "$TMP_FILE"

cp "$JSON_FILE" "$BACKUP_FILE"
cp "$TMP_FILE" "$JSON_FILE"

cd "$SCRIPT_DIR/functions/api"
npm install --omit=dev --no-audit --no-fund

cd "$SCRIPT_DIR"
tcb fn deploy api --force --env-id "$ENV_ID"

echo "Done. Create an HTTP trigger for /api, then put its URL into VITE_API_BASE."
