#!/bin/bash

set -euo pipefail

yq_get() {
    KEY=$1
    FILE=$2
    yq -e ".$KEY" "$FILE"
}

MAINDIR="/data/.public-pool"

### backend
CONFIG_FILE="$MAINDIR/start9/config.yaml"

BITCOIN_RPC_USER="$(yq_get 'user' "$CONFIG_FILE")"
export BITCOIN_RPC_USER
BITCOIN_RPC_PASSWORD="$(yq_get 'password' "$CONFIG_FILE")"
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
PROP_FILE="$MAINDIR/start9/stats.yaml"

TOR_ADDRESS="$(yq_get 'rpc-url' "$CONFIG_FILE")"

cat > $PROP_FILE <<EOF
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
