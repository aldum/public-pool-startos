import { sdk } from './sdk'
import { T } from '@start9labs/start-sdk'
import { uiPort } from './utils'

export const main = sdk.setupMain(async ({ effects, started }) => {
  /**
   * ======================== Setup (optional) ========================
   *
   * In this section, we fetch any resources or run any desired preliminary commands.
   */
  console.info('Starting...')
  /**
   * ======================== Additional Health Checks (optional) ========================
   *
   * In this section, we define *additional* health checks beyond those included with each daemon (below).
   */
  const healthReceipts: T.HealthReceipt[] = []

  const { PUBPOOL__server__ROOT_URL } =
    await sdk.store.getOwn(effects, sdk.StorePath).const()
  const env: PubPoolEnv = {
    PUBPOOL__server__ROOT_URL
  }
  /**
   * ======================== Daemons ========================
   *
   * In this section, we create one or more daemons that define the service runtime.
   *
   * Each daemon defines its own health check, which can optionally be exposed to the user.
   */
  return sdk.Daemons.of(effects, started, healthReceipts).addDaemon('primary', {
    image: { id: 'frontend' },
    command: ['/usr/bin/entrypoint', '--', '/bin/s6-svscan', '/etc/s6'],
    env,
    mounts: sdk.Mounts.of().addVolume('main', null, '/data', false),
    ready: {
      display: 'Web Interface',
      fn: () =>
        sdk.healthCheck.checkPortListening(effects, uiPort, {
          successMessage: 'Server is ready',
          errorMessage:
            'Server is experiencing an issue. Please check the logs.',
        }),
    },
    requires: [],
  })
})


type PubPoolEnv =  {
  PUBPOOL__server__ROOT_URL: string
}
