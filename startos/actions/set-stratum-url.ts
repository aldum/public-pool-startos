import { sdk } from "../sdk"
import { getStratUrls } from "../utils"

const { InputSpec, Value, Variants } = sdk

export const inputSpec = InputSpec.of({
  source: Value.union(
    {
      name: "URL Source",
      default: "system",
    },
    Variants.of(
      {
        system: {
          name: "System",
          spec: InputSpec.of({
            url: Value.dynamicSelect(async ({ effects }) => {
              const systemUrls = await getStratUrls(effects)

              return {
                name: "URL",
                values: systemUrls.reduce(
                  (obj, url) => ({
                    ...obj,
                    [url]: url,
                  }),
                  {} as Record<string, string>,
                ),
                default: systemUrls.find(
                  (u) => u.startsWith("http:") && u.includes(".onion"),
                ) || "",
              }
            }),
          }),
        },
        custom: {
          name: "Custom (for clearnet)",
          spec: InputSpec.of({
            url: Value.text({
              name: "URL",
              warning:
                `the domain of this URL must already exist in StartOS and be assigned to Gitea's HTTP interface`,
              required: true,
              default: null,
              inputmode: "url",
              patterns: [sdk.patterns.url],
              placeholder: "e.g. https://gitea.my-domain.dev",
            }),
          }),
        },
      },
    ),
  ),
})

export const setStratumUrl = sdk.Action.withInput(
  // id
  "set-primary-url",
  // metadata
  async ({ effects: _effects }) => (await {
    name: "Set Primary Url",
    description:
      "Choose which of your Gitea http URLs should serve as the primary URL for the purposes of creating links, sending invites, etc.",
    warning: null,
    allowedStatuses: "any",
    group: null,
    visibility: "enabled",
  }),
  // form input specification
  inputSpec,
  // optionally pre-fill the input form
  // async () => { },
  async ({ effects }) => {
    const systemUrls = await getStratUrls(effects)

    const url = await sdk.store
      .getOwn(effects, sdk.StorePath.STRATUM_URL)
      .const()

    return {
      source: {
        selection: !url || systemUrls.includes(url)
          ? ("system" as const)
          : ("custom" as const),
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

/*
const { InputSpec, Value } = sdk


export const inputSpec = InputSpec.of({
  url: Value.dynamicSelect(async ({ effects }) => {
    const stratUrls = await getStratUrls(effects)
    console.warn("urls", JSON.stringify(stratUrls))

    return {
      name: "URL",
      values: stratUrls.reduce(
        (obj, url) => ({
          ...obj,
          [url]: url,
        }),
        {} as Record<string, string>,
      ),
      default: `localhost:${stratPort}`,
      required: true,
    }
  }),
})

export const setStratumUrl = sdk.Action.withInput(
  "set-stratum-url",
  async () => (await {
    name: "Set Stratum URL",
    description: "Choose which of your URLs are advertised in the Web UI",
    warning: null,
    allowedStatuses: "any",
    group: null,
    visibility: "enabled",
  }),
  inputSpec,
  async ({ effects }) => {
    // const url = await sdk.store
    //   .getOwn(effects, sdk.StorePath.STRATUM_URL)
    //   .const()
    const url = "a"
    console.info(url)
    return {
      value: url,
      // source: {
      //   selection:
      //     !url || systemUrls.includes(url)
      //       ? ('system' as const)
      //       : ('custom' as const),
      //   value: { url },
      // },
    }
  },
  // the execution function
  async ({ effects, input }) => {
    await sdk.store.setOwn(
      effects,
      sdk.StorePath.STRATUM_URL,
      input.url,
    )
    // return {
    //   version: '1',
    //   title: 'URL successfully selected',
    //   message: '',
    //   result: null
    //   // {
    //   //   name: 'URL',
    //   //   type: "single",
    //   //   value: input.url,
    //   //   description: 'Primary URL',
    //   //   copyable: true,
    //   //   masked: false,
    //   //   qr: false,
    //   // },
    // }
  },
)
*/
