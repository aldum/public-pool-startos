#!/bin/sh

echo "Starting UI on port 80"
echo "Logs output: ${LOGLEVEL:-INFO} (${LOGFORMAT:-json})"

exec caddy run --config /assets/Caddyfile
