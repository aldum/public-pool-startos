import { sdk } from "./sdk"
import { T } from "@start9labs/start-sdk"
import { apiPort, stratPort, uiPort } from "./utils"
import { manifest as btcManifest } from "bitcoind-startos/startos/manifest"
import { ppEnv } from "./file-models/pubPoolEnv"

export const main = sdk.setupMain(async ({ effects, started }) => {
  console.info(
    "━━━━━━━━━━━━━━━━━━━━━━━━━━━━ Starting Public Pool ━━━━━━━━━━━━━━━━━━━━━━━━━━━━",
  )

  const healthReceipts: T.HealthReceipt[] = []

  const pubpoolEnv: ppEnv = {
    BITCOIN_RPC_URL: "http://bitcoind.startos",
    BITCOIN_RPC_PORT: "8332",
    BITCOIN_RPC_TIMEOUT: "25000",
    STRATUM_PORT: stratPort.toString(),
    API_PORT: apiPort.toString(),
    NETWORK: "mainnet",
    API_SECURE: "false",
    ENABLE_SOLO: "true",
    ENABLE_PROXY: "false",
    BITCOIN_RPC_COOKIEFILE: "/btcd/.cookie",
  }

  await sdk.action.run({ effects, actionId: "set-env", input: {} })

  const daemons = sdk.Daemons.of(effects, started, healthReceipts)

  daemons.addDaemon("pool", {
    subcontainer: { imageId: "backend" },
    command: ["/usr/local/bin/node", "/public-pool/dist/main"],
    env: pubpoolEnv,
    mounts: sdk.Mounts.of()
      .addVolume("pool", "db", "/public-pool/DB", false)
      .addDependency<
        typeof btcManifest
      >("bitcoind", "main", null, "/btcd", true),
    ready: {
      display: "Stratum Interface",
      fn: () =>
        sdk.healthCheck.checkPortListening(effects, stratPort, {
          successMessage: "Stratum is ready",
          errorMessage:
            "Stratum is experiencing an issue. Please check the logs.",
        }),
    },
    requires: [],
  })

  const frontend = await sdk.SubContainer.of(effects,
    { imageId: "frontend" },
    "frontend"
  )
  frontend.mount(
    {
      type: "assets",
      id: "frontend",
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

  daemons.addDaemon("frontend", {
    subcontainer: frontend,
    command: ["/bin/sh", "/assets/entrypoint.sh"],
    env: {
      HOME: "/home",
    },
    mounts: sdk.Mounts.of()
    ,
    ready: {
      display: "Web Interface",
      fn: () =>
        sdk.healthCheck.checkPortListening(effects, uiPort, {
          successMessage: "UI is ready",
          errorMessage:
            "Server is experiencing an issue. Please check the logs.",
        }),
    },
    requires: [],
  })

  return daemons
})
