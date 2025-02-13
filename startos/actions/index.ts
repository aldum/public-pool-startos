import { sdk } from "../sdk"
import { setEnv } from "./set-env"
import { setStratumUrl } from "./set-stratum-url"

export const actions = sdk.Actions.of()
  .addAction(setStratumUrl)
  .addAction(setEnv)
