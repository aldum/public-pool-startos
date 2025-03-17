import { sdk } from "../sdk"
import { setAuth } from "./set-auth"
import { setEnv } from "./set-env"
import { setStratumUrl } from "./set-stratum-url"

export const actions = sdk.Actions.of()
  .addAction(setStratumUrl)
  .addAction(setAuth)
  .addAction(setEnv)
