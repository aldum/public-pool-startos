import { setupExposeStore } from "@start9labs/start-sdk";
// import { sdk } from './sdk'

export type Store = Record<string | number | symbol, never>;
//   {
//   PUBPOOL__server__ROOT_URL: string
// };

export const exposedStore = setupExposeStore<Store>(() => []);
