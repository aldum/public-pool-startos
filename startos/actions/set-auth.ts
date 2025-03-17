import { utils } from '@start9labs/start-sdk'
import { sdk } from '../sdk'
import { randomPassword } from '../utils'
import { generateRpcUserDependent } from
  'bitcoind-startos/startos/actions/generateRpcUserDependent'

const { InputSpec, Value } = sdk

export const inputSpec = InputSpec.of({
  auth: Value.select({
    name: "Auth",
    default: 'userpass',
    values: {
      'userpass': "Username and password",
      'cookie': 'Cookie',
    },
  })
})

const genpw = async (effects) => {
  const randname = utils.getDefaultString({ charset: 'a-z,A-Z', len: 8 })
  const btcUsername = `pubpool_${randname}`
  const btcPassword = utils.getDefaultString(randomPassword())

  await sdk.action.request(
    effects,
    'bitcoind',
    generateRpcUserDependent,
    'critical',
    {
      input: {
        kind: 'partial',
        value: {
          username: btcUsername,
          password: btcPassword,
        },
      },
      // reason: 'BTC Shell needs an RPC user in Bitcoin',
    }
  )
  return {
    USER: btcUsername,
    PASSWORD: btcPassword,
  }
}

export const setAuth = sdk.Action.withInput(
  'set-auth',
  async () => (
    {
      name: 'Auth',
      description: 'Set bitcoind auth mode',
      warning: null,
      allowedStatuses: 'any',
      group: 'Options',
      visibility: 'enabled',
    }
  ),
  inputSpec,
  async ({ effects }) => {
    auth: sdk.store
      .getOwn(effects, sdk.StorePath.AUTH)
      .const()
  },

  async ({ effects, input }) => {
    switch (input.auth) {
      case 'cookie':
        sdk.store.setOwn(effects, sdk.StorePath.AUTH, 'COOKIE')
      case 'userpass':
        const upw = await sdk.store
          .getOwn(effects, sdk.StorePath.USERPASS)
          .once()
        if (!upw) {
          const creds = await genpw(effects)
          await sdk.store.setOwn(effects, sdk.StorePath.USERPASS, creds)
        }
        await sdk.store.setOwn(effects, sdk.StorePath.AUTH, 'USERPASS')
    }
  }
)
