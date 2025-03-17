import { sdk } from "./sdk"
import { exposedStore } from "./store"
import { setDependencies } from "./dependencies"
import { setInterfaces } from "./interfaces"
import { versions } from "./versions"
import { actions } from "./actions"
import { requestIfNotSet as stratCondRequest } from
  "./actions/set-stratum-url"
import { request as authRequest } from "./actions/set-auth"
import { defaultStratUrl } from "./utils"

// **** Install ****
const install = sdk.setupInstall(async ({ effects }) => {
  await stratCondRequest(effects)
  await authRequest(effects)
})
// **** Uninstall ****
const uninstall = sdk.setupUninstall(async () => { })

/**
 * Plumbing. DO NOT EDIT.
 */
export const { packageInit, packageUninit, containerInit } = sdk.setupInit(
  versions,
  install,
  uninstall,
  setInterfaces,
  setDependencies,
  actions,
  {
    STRATUM_URL: defaultStratUrl,
    AUTH: undefined,
    USERPASS: undefined
  },
  exposedStore,
)
