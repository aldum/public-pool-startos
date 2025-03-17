
  BITCOIN_RPC_URL: "http://bitcoind.startos"
  BITCOIN_RPC_PORT: "8332"
  BITCOIN_RPC_TIMEOUT: string
  API_PORT: string
  STRATUM_PORT: string
  NETWORK: "mainnet"
  API_SECURE: "false"
  ENABLE_SOLO: "true"
  ENABLE_PROXY: "false"
}

export type pubpoolENv = baseEnv & {
  BITCOIN_RPC_COOKIEFILE: "/btcd/.cookie"
} | baseEnv & {
  BITCOIN_RPC_USER: string,
  BITCOIN_RPC_PASSWORD: string,
}
