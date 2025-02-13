import { sdk } from "../sdk"
import { defaultStratUrl, getStratUrls } from "../utils"

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
      default: defaultStratUrl,
      required: true,
    }
  }),
})

export const setStratumUrl = sdk.Action.withInput(
  "set-stratum-url",
  async () =>
    await {
      name: "Set Stratum URL",
      description: "Choose which of your URLs are advertised in the Web UI",
      warning: null,
      allowedStatuses: "any",
      group: null,
      visibility: "enabled",
    },
  inputSpec,
  async ({ effects }) => {
    const url = await sdk.store
      .getOwn(effects, sdk.StorePath.STRATUM_URL)
      .const()
    return {
      url: url,
    }
  },
  // the execution function
  async ({ effects, input }) => {
    await sdk.store.setOwn(effects, sdk.StorePath.STRATUM_URL, input.url)
    return {
      version: "1",
      title: "URL successfully selected",
      message: "",
      result: {
        name: "URL",
        type: "single",
        value: input.url,
        description: "Primary URL",
        copyable: true,
        masked: false,
        qr: false,
      },
    }
  },
)
