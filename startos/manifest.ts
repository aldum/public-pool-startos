import { setupManifest } from "@start9labs/start-sdk"

export const manifest = setupManifest({
  id: "public-pool",
  title: "Public Pool",
  license: "mit",
  wrapperRepo: "https://github.com/aldum/public-pool-startos",
  upstreamRepo: "https://github.com/benjamin-wilson/public-pool",
  supportSite: "https://github.com/benjamin-wilson/public-pool/issues",
  marketingSite: "https://github.com/benjamin-wilson/public-pool",
  donationUrl: null,
  description: {
    short: "A Nestjs and Typescript Bitcoin stratum mining server",
    long: "A Nestjs and Typescript Bitcoin stratum mining server",
  },
  hardwareRequirements: {},

  assets: ["frontend"],
  volumes: ["pool"],
  images: {
    backend: {
      source: {
        dockerTag: "sethforprivacy/public-pool",
      },
    },
    frontend: {
      source: {
        dockerTag: "ghcr.io/aldum/public-pool-ui",
      },
    },
  },
  alerts: {
    install: null,
    update: null,
    uninstall: null,
    restore: null,
    start: null,
    stop: null,
  },
  dependencies: {
    bitcoind: {
      description: "Communicate with the Bitcoin Network",
      optional: false,
      s9pk: "https://github.com/aldum/bitcoind-startos/releases/download/v28.1-1/bitcoind.s9pk",
    },
  },
})
