import { sdk } from "./sdk"
import { stratPort } from "./utils"

export const setInterfaces = sdk.setupInterfaces(async ({ effects }) => {
  // const uiMulti = sdk.host.multi(effects, "ui-multi");

  // http
  // const httpOrigin = await uiMulti.bindPort(uiPort, {
  //   protocol: 'http',
  // })
  // const httpInterface = sdk.createInterface(effects, {
  //   name: 'Web UI',
  //   id: 'http',
  //   description: 'Web UI for PubPool',
  //   type: 'ui',
  //   hasPrimary: true,
  //   masked: false,
  //   schemeOverride: null,
  //   username: null,
  //   path: '',
  //   search: {},
  // })
  // const httpReceipt = await httpOrigin.export([httpInterface])

  // return [httpReceipt]

  // Stratum
  const rpcMulti = sdk.host.multi(effects, "rpc")
  const stratOrigin = await rpcMulti.bindPort(stratPort, {
    protocol: "grpc",
  })
  const stratumInterface = sdk.createInterface(effects, {
    name: "stratum",
    id: "stratum",
    description: "Used for mining",
    type: "api",
    hasPrimary: false,
    masked: false,
    schemeOverride: null,
    username: "",
    path: "",
    search: {},
  })
  const stratReceipt = await stratOrigin.export([stratumInterface])

  // return [httpReceipt, stratReceipt]
  return [stratReceipt]
})
