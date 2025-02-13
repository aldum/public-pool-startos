import { sdk } from "./sdk"
import { Effects } from "@start9labs/start-sdk/base/lib/Effects"

// backend
export const stratPort = 3333
export const defaultStratUrl = `localhost:${stratPort}`
export const apiPort = 3334
export const apiURL = `backend.public-pool.startos:${apiPort}`
// frontend
export const uiPort = 80

export type InterfaceId = "stratum" | "http"

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
