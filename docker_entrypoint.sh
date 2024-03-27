#!/bin/bash

set -euo pipefail

CONFIG_FILE="/data/.public-pool/start9/config.yaml"

BITCOIN_RPC_USER=$(yq -r '.user' "$CONFIG_FILE")
export BITCOIN_RPC_USER
BITCOIN_RPC_PASSWORD=$(yq -r '.password' "$CONFIG_FILE")
export BITCOIN_RPC_PASSWORD

ENV_TEMPLATE="/root/.env.template"
DOTENV='.env'

cat > $DOTENV << EOF
BITCOIN_RPC_USER=$BITCOIN_RPC_USER
BITCOIN_RPC_PASSWORD=$BITCOIN_RPC_PASSWORD
EOF

cat $ENV_TEMPLATE >> $DOTENV

# exec tini -p SIGTERM -- bitcoind-manager
/usr/local/bin/node /opt/public-pool/dist/main
