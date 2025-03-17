
export type baseEnv = {
  BITCOIN_RPC_URL: "http://bitcoind.startos"
  BITCOIN_RPC_PORT: number
  BITCOIN_RPC_TIMEOUT: number
  API_PORT: number
  STRATUM_PORT: number
  NETWORK: "mainnet"
  API_SECURE: false
  ENABLE_SOLO: true
  ENABLE_PROXY: false
  ZMQ_ENABLED?: boolean
  POOL_IDENTIFIER: string
}

export type pubpoolENv = baseEnv & {
  BITCOIN_RPC_COOKIEFILE: "/btcd/.cookie"
} | baseEnv & {
  BITCOIN_RPC_USER: string,
  BITCOIN_RPC_PASSWORD: string,
}
