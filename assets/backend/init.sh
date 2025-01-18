#!/bin/sh -x

TF='/public-pool'
envfile="$TF/.env"

cp '/cfg/.env' $envfile

DIR='/btcd'
configfile="$DIR/bitcoin.conf"
USER=$(grep 'rpcuser' $configfile | cut -d'=' -f 2)
PASS=$(grep 'rpcpassword' $configfile | cut -d'=' -f 2)
echo "BITCOIN_RPC_USER='$USER'" >> "$envfile"
echo "BITCOIN_RPC_PASSWORD='$PASS'" >> "$envfile"

# and start
exec /usr/local/bin/node dist/main
