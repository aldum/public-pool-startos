#!/bin/sh -x

DIR='/btcd'

TF='/public-pool'
envfile="$TF/.env"

cat > "$envfile" << EOF
NETWORK="mainnet"
API_SECURE="false"
ENABLE_SOLO="true"
ENABLE_PROXY="false"

API_PORT="3334"
STRATUM_PORT="3333"
BITCOIN_RPC_URL="http://bitcoind.startos"
BITCOIN_RPC_PORT="8332"
BITCOIN_RPC_TIMEOUT="25000"
EOF

COOKIE="$DIR/.cookie"
if [ -f "$COOKIE" ]
then
  echo "has cookie"
  echo BITCOIN_RPC_COOKIEFILE="$COOKIE" >> "$envfile"
else
  configfile="$DIR/bitcoin.conf"
  USER=$(grep 'rpcuser' $configfile | cut -d'=' -f 2)
  PASS=$(grep 'rpcpassword' $configfile | cut -d'=' -f 2)

  echo "BITCOIN_RPC_USER='$USER'" >> "$envfile"
  echo "BITCOIN_RPC_PASSWORD='$PASS'" >> "$envfile"
fi

# and start
exec /usr/local/bin/node dist/main
