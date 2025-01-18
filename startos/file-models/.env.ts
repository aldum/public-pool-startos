import { FileHelper, matches } from "@start9labs/start-sdk"
import { dotenvToJson, jsonToDotenv } from "./fmutils"

const { object, string } = matches
// const { anyOf, literal } = matches
// const stringArray = matches.array(matches.string)
// const string = stringArray.map(([a]) => a)
// const number = stringArray.map(([a]) => Number(a))
// const bool = anyOf(literal("true"), literal("false"))

// export type ppEnv = {
//   BITCOIN_RPC_URL: "http://bitcoind.startos"
//   BITCOIN_RPC_PORT: number
//   BITCOIN_RPC_TIMEOUT: number
//   API_PORT: number
//   STRATUM_PORT: number
//   NETWORK: string
//   API_SECURE: boolean
//   ENABLE_SOLO: boolean
//   ENABLE_PROXY: boolean
//   BITCOIN_RPC_COOKIEFILE: string
// }
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
  BITCOIN_RPC_URL: string,
  BITCOIN_RPC_PORT: string,
  BITCOIN_RPC_TIMEOUT: string,
  API_PORT: string,
  STRATUM_PORT: string,
  NETWORK: string,
  API_SECURE: string,
  ENABLE_SOLO: string,
  ENABLE_PROXY: string,
  BITCOIN_RPC_USER: string,
  BITCOIN_RPC_PASSWORD: string,
  // BITCOIN_RPC_COOKIEFILE: string.optional(),
})

export const pubpoolEnvFile = FileHelper.raw(
  // "/public-pool/.env" + "fm",
  "/media/startos/volumes/pool/cfg/.env",
  jsonToDotenv<ppEnv>,
  dotenvToJson<ppEnv>,
  (obj) => shape.unsafeCast(obj),
)
