import { sdk } from "./sdk"
import { Effects } from "@start9labs/start-sdk/base/lib/Effects"

// backend
export const stratPort = 3333
export const defaultStratUrl = `localhost:${stratPort}`
export const apiPort = 3334
export const apiURL = `backend.public-pool.startos:${apiPort}`
// btc
export const rpcPort = 8332
// frontend
export const uiPort = 80

export type InterfaceId = "stratum" | "http"
export const urlScheme = 'stratum+tcp'

export async function getInterfaceUrls(
  effects: Effects,
  id: InterfaceId,
): Promise<string[]> {
  const netInterface = await sdk.serviceInterface.getOwn(effects, id).const()

  console.info("getInterfaceUrls", JSON.stringify(netInterface))

  return netInterface?.addressInfo?.urls || []
}

export function getStratUrls(effects: Effects): Promise<string[]> {
  return getInterfaceUrls(effects, "stratum")
}

export async function isStratumUrlSet(effects: Effects): Promise<Boolean> {
  const storedURL = await sdk.store.getOwn(effects,
    sdk.StorePath.STRATUM_URL
  ).const()
  return storedURL !== '' &&
    storedURL != defaultStratUrl
}

export function randomPassword() {
  return {
    // charset: 'a-z,A-Z,1-9,!,@,$,%,&,*',
    charset: 'a-z,A-Z,1-9',
    len: 22,
  }
}
