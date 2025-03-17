import { sdk } from "../sdk"
import { setStratumUrl } from "./set-stratum-url"
import { setAuth } from "./set-auth"
import { setEnv } from "./set-env"
import { configure } from "./configure"

export const actions = sdk.Actions.of()
  .addAction(setStratumUrl)
  .addAction(setAuth)
  .addAction(setEnv)
  .addAction(configure)
