import { sdk } from "./sdk"
import { apiPort, rpcPort, stratPort, uiPort } from "./utils"
import { baseEnv } from "./file-models/pubPoolEnv"
import { HealthCheck } from
  "@start9labs/start-sdk/package/lib/health/HealthCheck"
import { request as authRequest, getAuth }
  from "./actions/set-auth"
import { requestIfUnset as urlCondRequest }
  from "./actions/set-stratum-url"

export const main = sdk.setupMain(async ({ effects, started }) => {
  const decor_line = " ━━━━━━━━━━━━━━━━━━━━━━━━━━━━ "
  console.info(
    decor_line +
    "Starting Public Pool" +
    decor_line,
  )

  const auth = await getAuth(effects)
  if (!auth) { await authRequest(effects) }
  await urlCondRequest(effects)

  const apiHealth = sdk.HealthCheck.of(effects,
    {
      id: "api",
      name: "Pool API",
      fn: () =>
        sdk.healthCheck.checkPortListening(effects, apiPort, {
          successMessage: "",
          errorMessage:
            "The API is not reachable",
        }),
    }
  )
  const healthChecks: HealthCheck[] = [apiHealth]

  const baseEnv: baseEnv = {
    BITCOIN_RPC_URL: "http://bitcoind.startos",
    BITCOIN_RPC_PORT: rpcPort.toString(),
    BITCOIN_RPC_TIMEOUT: "25000",
    STRATUM_PORT: stratPort.toString(),
    API_PORT: apiPort.toString(),
    NETWORK: "mainnet",
    API_SECURE: "false",
    ENABLE_SOLO: "true",
    ENABLE_PROXY: "false",
  }
  const pubpoolEnv = await (async () => {
    switch (auth) {
      case 'COOKIE':
        return { ...baseEnv, BITCOIN_RPC_COOKIEFILE: "/btcd/.cookie" }
      case 'USERPASS':
        const upw = await sdk.store
          .getOwn(effects, sdk.StorePath.USERPASS)
          .const()
        if (upw) {
          const { USER, PASSWORD } = upw
          return {
            ...baseEnv,
            BITCOIN_RPC_USER: USER,
            BITCOIN_RPC_PASSWORD: PASSWORD,
          }
        }
    }
  })()

  const backend = await sdk.SubContainer.of(effects,
    { imageId: "backend" },
    "backend"
  )
  backend.mount(
    {
      type: "volume",
      id: "pool",
      subpath: "/public-pool/DB",
      readonly: false
    },
    "db",
  )
  backend.mount({
    type: "pointer",
    packageId: "bitcoind",
    volumeId: "main",
    subpath: null,
    readonly: true
  },
    "/btcd"
  )

  await sdk.action.run({ effects, actionId: "set-env", input: {} })

  const frontend = await sdk.SubContainer.of(effects,
    { imageId: "frontend" },
    "frontend"
  )
  frontend.mount(
    {
      type: "assets",
      subpath: null,
    },
    "/assets"
  )
  frontend.mount(
    {
      type: "volume",
      id: "pool",
      subpath: "env",
      readonly: false
    },
    "/var/www/html/env"
  )

  const daemons = sdk.Daemons.of(
    effects,
    started,
    healthChecks
  ).addDaemon("backend", {
    subcontainer: backend,
    command: ["/usr/local/bin/node", "/public-pool/dist/main"],
    env: pubpoolEnv,
    mounts: sdk.Mounts.of(),
    ready: {
      display: "Stratum Interface",
      gracePeriod: 15000,
      fn: () =>
        sdk.healthCheck.checkPortListening(effects, stratPort, {
          successMessage: "",
          errorMessage:
            "Stratum is experiencing an issue. Please check the logs.",
        }),
    },
    requires: [],
  }).addDaemon("frontend", {
    subcontainer: frontend,
    command: ["caddy", "run", "--config", "/assets/Caddyfile"],
    env: {
      HOME: "/home",
    },
    mounts: sdk.Mounts.of()
    ,
    ready: {
      display: "Web Interface",
      fn: () =>
        sdk.healthCheck.checkWebUrl(effects,
          `http://public-pool.startos:${uiPort}/api/info`,
          {
            successMessage: "",
          }
        )
    },
    requires: ["backend"],
  })

  return daemons
})
