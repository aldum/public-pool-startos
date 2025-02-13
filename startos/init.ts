import { sdk } from "./sdk"
import { exposedStore } from "./store"
import { setDependencies } from "./dependencies"
import { setInterfaces } from "./interfaces"
import { versions } from "./versions"
import { actions } from "./actions"
import { setStratumUrl } from "./actions/set-stratum-url"

// **** Install ****
const install = sdk.setupInstall(async ({ effects }) => {
  await sdk.action.requestOwn(effects, setStratumUrl, "important")
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
  exposedStore,
)
