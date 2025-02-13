import { sdk } from "./sdk"
import { T } from "@start9labs/start-sdk"
import { apiPort, stratPort, uiPort } from "./utils"
import { manifest as btcManifest } from "bitcoind-startos/startos/manifest"
import { pubpoolEnvFile } from "./file-models/_env"

export const main = sdk.setupMain(async ({ effects, started }) => {
  console.info(
    "━━━━━━━━━━━━━━━━━━━━━━━━━━━━ Starting Public Pool ━━━━━━━━━━━━━━━━━━━━━━━━━━━━",
  )

  const healthReceipts: T.HealthReceipt[] = []

  await sdk.action.run({ effects, actionId: "set-env", input: {} })
  const daemons = sdk.Daemons.of(effects, started, healthReceipts)

  pubpoolEnvFile.write({
    BITCOIN_RPC_URL: "http://bitcoind.startos",
    BITCOIN_RPC_PORT: "8332",
    BITCOIN_RPC_TIMEOUT: "25000",
    STRATUM_PORT: stratPort.toString(),
    API_PORT: apiPort.toString(),
    NETWORK: "mainnet",
    API_SECURE: "false",
    ENABLE_SOLO: "true",
    ENABLE_PROXY: "false",
    BITCOIN_RPC_USER: "bitcoin",
    // BITCOIN_RPC_PASSWORD: "",
    BITCOIN_RPC_PASSWORD: "",
    // BITCOIN_RPC_COOKIEFILE: "/btcd/.cookie",
    // BITCOIN_RPC_COOKIEFILE: undefined,
  })

  daemons.addDaemon("pool", {
    subcontainer: { imageId: "backend" },
    command: ["/bin/sh", "/assets/init.sh"],
    env: {},
    mounts: sdk.Mounts.of()
      .addVolume("pool", "db", "/public-pool/DB", false)
      .addVolume("pool", "cfg", "/cfg", true)
      .addAssets("backend", null, "/assets")
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

  daemons.addDaemon("frontend", {
    subcontainer: { imageId: "frontend" },
    command: ["/bin/sh", "/assets/entrypoint.sh"],
    env: {
      HOME: "/home",
    },
    mounts: sdk.Mounts.of()
      .addAssets("frontend", null, "/assets")
      .addVolume("pool", "env", "/var/www/html/env", true),
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
