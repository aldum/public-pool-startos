import { setupManifest } from "@start9labs/start-sdk"

export const manifest = setupManifest({
  id: "pubpool",
  title: "Public Pool",
  license: "mit",
  wrapperRepo: "https://git.aldum.pw/aldum/public-pool-startos",
  upstreamRepo: "https://github.com/benjamin-wilson/public-pool",
  supportSite: "https://github.com/benjamin-wilson/public-pool/issues",
  marketingSite: "https://github.com/benjamin-wilson/public-pool",
  donationUrl: null,
  description: {
    short: "A Nestjs and Typescript Bitcoin stratum mining server",
    long: "A Nestjs and Typescript Bitcoin stratum mining server",
  },
  hardwareRequirements: {},

  assets: ["backend", "frontend"],
  volumes: ["db"],
  images: {
    backend: {
      source: {
        dockerTag: "sethforprivacy/public-pool",
      },
    },
    frontend: {
      source: {
        dockerTag: "ghcr.io/aldum/public-pool-ui:alpine",
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
      s9pk: "../btcd-036/bitcoind-036.s9pk",
    },
  },
})
