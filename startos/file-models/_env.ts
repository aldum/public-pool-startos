import { FileHelper, matches } from "@start9labs/start-sdk"
import { dotenvToJson, jsonToDotenv } from "./fmutils"
import { apiPort, stratPort } from "../utils"

const { object, string, literal } = matches

export type ppEnv = {
  BITCOIN_RPC_URL: "http://bitcoind.startos"
  BITCOIN_RPC_PORT: "8332"
  BITCOIN_RPC_TIMEOUT: string
  API_PORT: string
  STRATUM_PORT: string
  NETWORK: "mainnet"
  API_SECURE: "false"
  ENABLE_SOLO: "true"
  ENABLE_PROXY: "false"
  BITCOIN_RPC_COOKIEFILE: string
}

const shape = object({
  BITCOIN_RPC_URL: literal("http://bitcoind.startos"),
  BITCOIN_RPC_PORT: literal("8332"),
  BITCOIN_RPC_TIMEOUT: string,
  API_PORT: literal(apiPort.toString()),
  STRATUM_PORT: literal(stratPort.toString()),
  NETWORK: literal("mainnet"),
  API_SECURE: literal("false"),
  ENABLE_SOLO: literal("true"),
  ENABLE_PROXY: literal("false"),
  BITCOIN_RPC_USER: string.optional(),
  BITCOIN_RPC_PASSWORD: string.optional(),
  BITCOIN_RPC_COOKIEFILE: string,
})

export const pubpoolEnvFile = FileHelper.raw(
  "/media/startos/volumes/pool/cfg/.env",
  jsonToDotenv<ppEnv>,
  dotenvToJson<ppEnv>,
  (obj) => shape.unsafeCast(obj),
)
