import { sdk } from '../sdk'
import { envjs } from "../file-models/env_js"
import { urlScheme } from "../utils"

export const setEnv = sdk.Action.withoutInput(
  'set-env',
  async () => (
    await {
      name: 'Deploy env.js',
      description: 'Set runtime environment for frontend',
      warning: null,
      allowedStatuses: 'any',
      group: null,
      visibility: 'hidden',
    }
  ),
  async ({ effects }) => {
    const rawUrl = await sdk.store
      .getOwn(effects, sdk.StorePath.STRATUM_URL)
      .const()
    const stratumUrl = rawUrl?.replace(`${urlScheme}://`, '')

    if (stratumUrl?.length > 0) {
      await envjs.write({ STRATUM_URL: stratumUrl })
    }

    return {
      version: '1',
      title: 'Success',
      message: "Env set",
      result: null,
    }
  }
)
