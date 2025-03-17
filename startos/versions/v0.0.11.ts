import { VersionInfo, IMPOSSIBLE } from "@start9labs/start-sdk"
import { sdk } from "../sdk"
import { defaultStratUrl } from "../utils"

export const v0_0_11 = VersionInfo.of({
  version: "0.0.11:0",
  releaseNotes: "Revamped for StartOS 0.3.6",
  migrations: {
    up: async ({ effects }) => {
      await sdk.store.setOwn(effects, sdk.StorePath, {
        STRATUM_URL: defaultStratUrl,
        AUTH: undefined,
        USERPASS: undefined
      })
    },
    down: IMPOSSIBLE,
  },
})
