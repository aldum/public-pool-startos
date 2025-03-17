import { setupExposeStore } from "@start9labs/start-sdk"

export type Store = {
  STRATUM_URL: string,
  AUTH: 'COOKIE' | 'USERPASS' | undefined,
  USERPASS: {
    USER: string,
    PASSWORD: string
  } | undefined
}

export const exposedStore = setupExposeStore<Store>(() => [])
