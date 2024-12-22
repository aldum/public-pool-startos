import { setupExposeStore } from "@start9labs/start-sdk"

export type Store = {
  STRATUM_URL: string
}

export const exposedStore = setupExposeStore<Store>(() => [])
