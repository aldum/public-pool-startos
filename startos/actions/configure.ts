import { sdk } from '../sdk'

const { InputSpec, Value } = sdk

export const inputSpec = InputSpec.of({
  zmq_enabled: Value.dynamicToggle(async ({ effects }) => {
    return {
      name: 'ZeroMQ Enabled',
      default: false,
      description:
        'Connect to bitcoind via ZeroMQ',
      // TODO: actually check this
      disabled: 'Has to be enabled in bitcoind config',
    }
  }),
  pool_id: Value.text(
    {
      name: "Pool identifier",
      description:
        "This is included in the coinbase transaction",
      required: true,
      default: "Public Pool",
    }),
  rpc_timeout: Value.number({
    name: "RPC timeout (ms)",
    default: 25000,
    integer: true,
    required: true,
    min: 1000,
  }),
})

export const configure = sdk.Action.withInput(
  'configure',
  async () => (
    {
      name: 'Configure',
      description: 'Set pool options',
      warning: null,
      allowedStatuses: 'any',
      group: 'Options',
      visibility: 'enabled',
    }
  ),
  inputSpec,
  // prefill
  async ({ effects }) => {
    const store = await sdk.store.getOwn(effects,
      sdk.StorePath).const()
    return {
      zmq_enabled: store.ZMQ_ENABLED,
      pool_id: store.POOL_ID,
      rpc_timeout: store.RPC_TIMEOUT,
    }
  },
  // execute
  async ({ effects, input }) => {
    await sdk.store.setOwn(effects,
      sdk.StorePath.ZMQ_ENABLED, input.zmq_enabled)
    await sdk.store.setOwn(effects,
      sdk.StorePath.POOL_ID, input.pool_id)
    await sdk.store.setOwn(effects,
      sdk.StorePath.RPC_TIMEOUT, input.rpc_timeout)
  }
)
