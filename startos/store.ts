import { setupExposeStore } from '@start9labs/start-sdk'
// import { sdk } from './sdk'

export type Store = {
  PUBPOOL__server__ROOT_URL: string
}

export const exposedStore = setupExposeStore<Store>(() => [])
