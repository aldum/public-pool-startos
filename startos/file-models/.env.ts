import { FileHelper, matches } from "@start9labs/start-sdk"

const { anyOf, literal } = matches
const object = matches.object
const stringArray = matches.array(matches.string)
const string = stringArray.map(([a]) => a)
const number = stringArray.map(([a]) => Number(a))
const bool = anyOf(literal("true"), literal("false"))

export const shape = object({
  BITCOIN_RPC_URL: literal("http://bitcoind.startos"),
  BITCOIN_RPC_PORT: number,
  BITCOIN_RPC_TIMEOUT: number,
  API_PORT: number,
  STRATUM_PORT: number,
  NETWORK: string,
  API_SECURE: bool,
  ENABLE_SOLO: bool,
  ENABLE_PROXY: bool,
})

function fromBackendEnv(text: string): Record<string, string[]> {
  const lines = text.split("/n")
  const dictionary = {} as Record<string, string[]>

  for (const line of lines) {
    const [key, value] = line.split("=", 2)
    const trimmedKey = key.trim()
    const trimmedValue = value.trim()

    if (!dictionary[trimmedKey]) {
      dictionary[trimmedKey] = []
    }

    dictionary[trimmedKey].push(trimmedValue)
  }

  return dictionary
}

function toBackendEnv(
  conf: Record<string, readonly string[] | string[] | string | number>,
): string {
  let res = ""

  Object.entries(conf).forEach(([key, value]) => {
    if (Array.isArray(value)) {
      for (const subValue of value) {
        res += `${key}=${subValue}\n`
      }
    } else {
      res += `${key}=${value}\n`
    }
  })
  return res
}

export const backendEnvFile = FileHelper.raw(
  "/public-pool/.env",
  (obj: typeof shape._TYPE) => toBackendEnv(obj), // BitcoinConf.typeof
  (str: string) => fromBackendEnv(str),
  (obj) => shape.unsafeCast(obj),
)
