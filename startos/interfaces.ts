import { sdk } from './sdk'
import { uiPort } from './utils'

export const setInterfaces = sdk.setupInterfaces(async ({ effects }) => {
  const uiMulti = sdk.host.multi(effects, 'ui-multi')

  // http
  const httpOrigin = await uiMulti.bindPort(uiPort, {
    protocol: 'http',
  })
  const httpInterface = sdk.createInterface(effects, {
    name: 'Web UI',
    id: 'http',
    description: 'Web UI for PubPool',
    type: 'ui',
    hasPrimary: true,
    masked: false,
    schemeOverride: null,
    username: null,
    path: '',
    search: {},
  })
  const httpReceipt = await httpOrigin.export([httpInterface])

  // // ssh
  // const stratOrigin = await uiMulti.bindPort(3333, {
  //   protocol: 'grpc',
  // })
  // const stratumInterface = sdk.createInterface(effects, {
  //   name: 'stratum',
  //   id: 'stratum',
  //   description: 'Used for mining',
  //   type: 'api',
  //   hasPrimary: false,
  //   masked: false,
  //   schemeOverride: null,
  //   username: '',
  //   path: '',
  //   search: {},
  // })
  // const stratReceipt = await stratOrigin.export([stratumInterface])

  // return [httpReceipt, stratReceipt]
  return [httpReceipt]
})
