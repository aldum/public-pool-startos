import { sdk } from '../sdk'
import { getStratUrls } from '../utils'

const { InputSpec, Value, Variants } = sdk

export const inputSpec = InputSpec.of({
  source: Value.union(
    {
      name: 'URL Source',
      default: 'system',
    },
    Variants.of({
      system: {
        name: 'System',
        spec: InputSpec.of({
          url: Value.dynamicSelect(async ({ effects }) => {
            const systemUrls = await getStratUrls(effects)

            return {
              name: 'URL',
              values: systemUrls.reduce(
                (obj, url) => ({
                  ...obj,
                  [url]: url,
                }),
                {} as Record<string, string>,
              ),
              default:
                systemUrls.find(
                  (u) => u.startsWith('http:') && u.includes('.onion'),
                ) || '',
              required: true,
            }
          }),
        }),
      },
      custom: {
        name: 'Custom (for clearnet)',
        spec: InputSpec.of({
          url: Value.text({
            name: 'URL',
            warning: `the domain of this URL must already exist in StartOS and be assigned to PubPool`,
            required: true,
            default: null,
            inputmode: 'url',
            patterns: [sdk.patterns.url],
            placeholder: 'e.g. https://pubpool.my-domain.dev',
          }),
        }),
      },

    }),
  ),
})

export const setStratumUrl = sdk.Action.withInput(
  'set-stratum-url',
  async ({ effects }) => ({
    name: 'Set Stratum Url',
    description:
      'Choose which of your URLs are advertised in the Web UI',
    warning: null,
    allowedStatuses: 'any',
    group: null,
    visibility: 'enabled',
  }),
  inputSpec,
  async ({ effects }) => {
    const systemUrls = await getStratUrls(effects)

    const url = await sdk.store
      .getOwn(effects, sdk.StorePath.STRATUM_URL)
      .const()
    return {
      source: {
        selection:
          !url || systemUrls.includes(url)
            ? ('system' as const)
            : ('custom' as const),
        value: { url },
      },
    }
  },

  // the execution function
  async ({ effects, input }) =>
    sdk.store.setOwn(
      effects,
      sdk.StorePath.STRATUM_URL,
      input.source.value.url,
    ),
)
