import { sdk } from "./sdk"
import { Effects } from "@start9labs/start-sdk/base/lib/Effects"

export const uiPort = 80
export const stratPort = 3333
export const apiPort = 3334
export const apiURL = `backend.pubpool.startos:${apiPort}`

export async function getInterfaceUrls(
  effects: Effects, id : string
): Promise<string[]> {
  const netInterface = await sdk.serviceInterface
    .getOwn(effects, id)
    .const()

  return netInterface?.addressInfo?.urls || []
}

export function getStratUrls(
  effects: Effects
): Promise<string[]> {
  return getInterfaceUrls(effects, 'stratum')
}
