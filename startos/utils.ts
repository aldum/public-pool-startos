import { sdk } from "./sdk"
import { Effects } from "@start9labs/start-sdk/base/lib/Effects"

export const uiPort = 80
export const stratPort = 3333
export const apiPort = 3334
export const apiURL = `backend.pubpool.startos:${apiPort}`

// export async function getHttpInterfaceUrls(
//   effects: Effects,
// ): Promise<string[]> {
//   const httpInterface = await sdk.serviceInterface
//     .getOwn(effects, 'http')
//     .const()

//   return httpInterface?.addressInfo?.urls || []
// }
