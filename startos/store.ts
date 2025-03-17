import { setupExposeStore } from "@start9labs/start-sdk"

export type Store = {
  STRATUM_URL: string,
  AUTH: 'COOKIE' | 'USERPASS' | undefined,
  USERPASS: {
    USER: string,
    PASSWORD: string
  } | undefined,
  POOL_ID: string,
  RPC_TIMEOUT: number,
  ZMQ_ENABLED: boolean,
}

export const exposedStore = setupExposeStore<Store>(() => [])
