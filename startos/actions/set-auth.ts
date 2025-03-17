import { utils } from '@start9labs/start-sdk'
import { Effects } from '@start9labs/start-sdk/base/lib/Effects'
import { sdk } from '../sdk'
import { randomPassword } from '../utils'
import { generateRpcUserDependent } from
  'bitcoind-startos/startos/actions/generateRpcUserDependent'

const { InputSpec, Value } = sdk

const defaultAuth = 'USERPASS'

export const inputSpec = InputSpec.of({
  auth: Value.select({
    name: "Auth",
    default: defaultAuth,
    values: {
      'USERPASS': "Username and password",
      'COOKIE':
        "Cookie (currently this requires a full node)",
    },
  })
})

const genpw = async (effects: Effects) => {
  const randname = utils.getDefaultString({
    charset: 'a-z,A-Z', len: 8
  })
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
      reason: 'Public Pool needs RPC credentials in Bitcoin',
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
  // prefill
  async ({ effects }) => {
    const auth = await getAuth(effects)
    return { auth: auth || defaultAuth }
  },
  // execute
  async ({ effects, input }) => {
    const authType = input.auth
    if (authType == 'USERPASS') {
      const upw = await sdk.store
        .getOwn(effects,
          sdk.StorePath.USERPASS)
        .once()
      if (!upw) {
        const creds = await genpw(effects)
        await sdk.store.setOwn(effects,
          sdk.StorePath.USERPASS,
          creds)
      }
    }
    await sdk.store.setOwn(effects,
      sdk.StorePath.AUTH, authType)
  }
)

export const request = (effects: Effects) =>
  sdk.action.requestOwn(effects, setAuth, 'critical', {
    reason:
      "Set up bitcoind authentication mode and credentials"
  })

export const getAuth = async (effects: Effects) => {
  return await sdk.store.getOwn(effects,
    sdk.StorePath.AUTH).const()
}
