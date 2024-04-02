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

# Properties Page

TOR_ADDRESS=$(yq -r '.rpc-url' "$CONFIG_FILE")

cat <<EOF > /root/start9/stats.yaml
version: 2
data:
  Stratum URL:
    type: string
    value: "stratum+tcp://$TOR_ADDRESS:3333"
    description: Address for miners
    copyable: true
    masked: false
    qr: true
EOF


### run
/usr/local/bin/node /opt/public-pool/dist/main &
exec caddy run --config $CADDY_CONFIG &

wait -n
