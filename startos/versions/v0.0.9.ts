import { VersionInfo, IMPOSSIBLE } from '@start9labs/start-sdk'
import { sdk } from '../sdk'
import { readFile, rmdir } from 'fs/promises'
import { load } from 'js-yaml'
import { getHttpInterfaceUrls } from '../utils'

export const v0_0_9 = VersionInfo.of({
  version: '0.0.9:0',
  releaseNotes: 'Revamped for StartOS 0.3.6',
  migrations: {
    up: async ({ effects }) => {
      // get old config.yaml
      // const { 'email-notifications': smtp, 'local-mode': localMode } = load(
      //   await readFile('/root/start9/config.yaml', 'utf-8'),
      // ) as {
      //   'email-notifications'?: {
      //     'smtp-host': string
      //     'smtp-port': number
      //     'smtp-user': string
      //     'smtp-pass': string
      //     'from-name': string
      //   }
      //   'local-mode': boolean
      // }

      const urls = await getHttpInterfaceUrls(effects)

      // initialize the store
      await sdk.store.setOwn(effects, sdk.StorePath, {
        PUBPOOL__server__ROOT_URL: urls.find((u) =>
          true
            ? u.includes('.local')
            : u.startsWith('http:') && u.includes('.onion'),
        )!,

      })

      // remove old start9 dir
      await rmdir('/data/start9')
    },
    down: IMPOSSIBLE,
  },
})
