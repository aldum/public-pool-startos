import { sdk } from "./sdk"
import { exposedStore } from "./store"
import { setDependencies } from "./dependencies"
import { setInterfaces } from "./interfaces"
import { versions } from "./versions"
import { actions } from "./actions"
// import { utils } from '@start9labs/start-sdk'
// import { setPrimaryUrl } from './actions/set-primary-url'
import { setStratumUrl } from "./actions/set-stratum-url"

// **** Install ****
const install = sdk.setupInstall(async ({ effects }) => {
  console.info("━━━━━ init start ━━━━━")
  // await sdk.store.setOwn(effects, sdk.StorePath, {
  //   PUBPOOL__server__ROOT_URL: '',
  // })
  await sdk.action.requestOwn(effects, setStratumUrl, "important")
})
// **** Uninstall ****
const uninstall = sdk.setupUninstall(async () => {})

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
