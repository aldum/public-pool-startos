import { FileHelper, matches } from "@start9labs/start-sdk"
import { dotenvToJson, jsonToDotenv } from "./fmutils"
import { apiPort, stratPort } from "../utils"

const { object, string, literal } = matches

export type ppEnv = {
  BITCOIN_RPC_URL: string
  BITCOIN_RPC_PORT: string
  BITCOIN_RPC_TIMEOUT: string
  API_PORT: string
  STRATUM_PORT: string
  NETWORK: string
  API_SECURE: string
  ENABLE_SOLO: string
  ENABLE_PROXY: string
  BITCOIN_RPC_USER: string
  BITCOIN_RPC_PASSWORD: string
  // BITCOIN_RPC_COOKIEFILE: string | undefined
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
  BITCOIN_RPC_USER: string,
  BITCOIN_RPC_PASSWORD: string,
  // BITCOIN_RPC_COOKIEFILE: string.optional(),
})

export const pubpoolEnvFile = FileHelper.raw(
  "/media/startos/volumes/pool/cfg/.env",
  jsonToDotenv<ppEnv>,
  dotenvToJson<ppEnv>,
  (obj) => shape.unsafeCast(obj),
)
