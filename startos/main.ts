import { sdk } from "./sdk"
import { T } from "@start9labs/start-sdk"
import { apiPort, stratPort, uiPort } from "./utils"
import { manifest as btcManifest } from 'bitcoind-startos/startos/manifest'

export const main = sdk.setupMain(async ({ effects, started }) => {
  console.info(
    "━━━━━━━━━━━━━━━━━━━━━━━━━━━━ Starting Public Pool ━━━━━━━━━━━━━━━━━━━━━━━━━━━━",
  )

  const healthReceipts: T.HealthReceipt[] = []

  const daemons = sdk.Daemons.of(effects, started, healthReceipts)

  daemons.addDaemon(
    "pool",
    {
      subcontainer: { imageId: "backend" },
      command: ["/bin/sh", "/assets/init.sh"],
      env: {},
      mounts: sdk.Mounts.of()
        .addVolume("db", null, "/public-pool/DB", false)
        .addAssets("backend", null, "/assets")
        .addDependency<typeof btcManifest>(
          'bitcoind', 'main', null, '/btcd', true)
        ,
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
    },
  )

  daemons.addDaemon(
    "frontend",
    {
      subcontainer: { imageId: "frontend" },
      command: ["/bin/sh", "/assets/entrypoint.sh"],
      env: {
        HOME: "/home",
      },
      mounts: sdk.Mounts.of()
        .addAssets("frontend", null, "/assets"),
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
    },
  )

  return daemons
})
