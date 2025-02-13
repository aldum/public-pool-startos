import { sdk } from "../sdk"
import { setStratumUrl } from "./set-stratum-url"

export const actions = sdk.Actions.of().addAction(setStratumUrl)
