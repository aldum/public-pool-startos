#!/bin/bash

set -euo pipefail


### backend
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


### frontend
CADDY_TEMPLATE='/root/Caddyfile.template'
CADDY_CONFIG='/etc/Caddyfile'

if [ ! -e $CADDY_CONFIG ]; then
    sed -i "s#%%LOGLEVEL%%#${LOGLEVEL:-INFO}#g" $CADDY_TEMPLATE
    sed -i "s#%%LOGFORMAT%%#${LOGFORMAT:-json}#g" $CADDY_TEMPLATE
    mv $CADDY_TEMPLATE $CADDY_CONFIG
else
    rm -f $CADDY_CONFIG
fi


### run
# exec tini -p SIGTERM -- bitcoind-manager
/usr/local/bin/node /opt/public-pool/dist/main &
exec caddy run --config $CADDY_CONFIG
# TODO proper init/pm
