#!/bin/bash

DURATION=$(</dev/stdin)
if ((DURATION <= 5500)); then
    exit 60
else
    NC_OUT=$(echo '{"id": 0, "method": "mining.configure", "params": ["nc"]}' \
        | nc -N localhost 3333| jq .error)
    EXIT_CODE=$?
    if [[ $NC_OUT == 'null' ]]
    then
        echo "RPC is ready for connections"
        exit 0
    elif [[ $EXIT_CODE -ne 0 ]]
    then
        echo "RPC is unreachable"
        exit 61
    fi
fi
