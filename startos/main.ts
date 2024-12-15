import { sdk } from "./sdk"
import { T } from "@start9labs/start-sdk"
import { apiPort, apiURL, stratPort, uiPort } from "./utils"

export const main = sdk.setupMain(async ({ effects, started }) => {
  /**
   * ======================== Setup (optional) ========================
   *
   * In this section, we fetch any resources or run any desired preliminary commands.
   */
  console.info("Starting...")
  /**
   * ======================== Additional Health Checks (optional) ========================
   *
   * In this section, we define *additional* health checks beyond those included with each daemon (below).
   */
  const healthReceipts: T.HealthReceipt[] = []

  console.info(
    "==================== Starting Public Pool =====================",
  )

  /**
   * ======================== Daemons ========================
   *
   * In this section, we create one or more daemons that define the service runtime.
   *
   * Each daemon defines its own health check, which can optionally be exposed to the user.
   */
  const daemons = sdk.Daemons.of(effects, started, healthReceipts)

  daemons.addDaemon(
    "primary",
    {
      image: { id: "backend" },
      command: ["/usr/local/bin/node", "dist/main"],
      env: {
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
        BITCOIN_RPC_PASSWORD: "mlot7q2qyt5u4pymta2d",
      },
      mounts: sdk.Mounts.of().addVolume("db", null, "/public-pool/DB", false),
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
      image: { id: "frontend" },
      command: ["/bin/sh", "/assets/entrypoint.sh"],
      env: {
        HOME: "/home",
      },
      mounts: sdk.Mounts.of().addAssets("frontend", null, "/assets"),
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
