import { sdk } from "./sdk"

export const setDependencies = sdk.setupDependencies(
  async ({ effects }) => {
    return {
      bitcoind: {
        kind: "running",
        versionRange: ">=27.1.0",
        // healthChecks: ["primary"],
        healthChecks: ["rpc"],
      },
    }
  },
)
