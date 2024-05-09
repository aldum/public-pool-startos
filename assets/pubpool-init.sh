#!/bin/bash

/usr/local/bin/node /opt/public-pool/dist/main &
exec caddy run --config "$CADDY_CONFIG" &

wait -n
