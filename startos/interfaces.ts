import { sdk } from "./sdk"
import { InterfaceId, stratPort, uiPort } from "./utils"

export const setInterfaces = sdk.setupInterfaces(async ({ effects }) => {
  // Stratum
  const rpcMulti = sdk.MultiHost.of(effects, "rpc")
  const stratOrigin = await rpcMulti.bindPort(stratPort, {
    preferredExternalPort: 3333,
    secure: { ssl: false },
    addSsl: null,
    protocol: null,
  })
  const stratId: InterfaceId = "stratum"
  const stratumInterface = sdk.createInterface(effects, {
    name: "stratum",
    id: stratId,
    description: "Used for connecting miners",
    type: "api",
    masked: false,
    schemeOverride: { noSsl: "stratum+tcp", ssl: null },
    username: "",
    path: "",
    search: {},
  })
  const stratReceipt = await stratOrigin.export([stratumInterface])

  const uiMulti = sdk.MultiHost.of(effects, "ui-multi")

  // http
  const httpOrigin = await uiMulti.bindPort(uiPort, {
    protocol: "http",
  })
  const uiId: InterfaceId = "http"
  const httpInterface = sdk.createInterface(effects, {
    name: "Web UI",
    id: uiId,
    description: "Web UI for PubPool",
    type: "ui",
    masked: false,
    schemeOverride: null,
    username: null,
    path: "",
    search: {},
  })
  const httpReceipt = await httpOrigin.export([httpInterface])

  return [httpReceipt, stratReceipt]
})
