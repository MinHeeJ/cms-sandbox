#!/usr/bin/env bash
set -euo pipefail

ROOT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")/../.." && pwd)"
cd "$ROOT_DIR"

echo "[check] backend test command: mvn test (run inside backend/)"
echo "[check] frontend test command: npm test && npm run build (run inside frontend/)"
echo "[check] compose config"
docker compose -f infra/docker-compose.yml config >/tmp/cms-compose-config.yml
echo "[check] license/vulnerability gate: review software_components and vulnerability_records before production deployment"
echo "[check] local preview: docker compose -f infra/docker-compose.yml up --build"
