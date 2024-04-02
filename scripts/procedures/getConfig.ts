import { types as T, compat } from "../deps.ts";

export const getConfig: T.ExpectedExports.getConfig = compat.getConfig({
  "rpc-url": {
    name: "Pool Tor Address",
    description: "The Tor address of Public Pool.",
    type: "pointer",
    subtype: "package",
    "package-id": "pubpool",
    target: "tor-address",
    interface: "public-pool",
  },
  user: {
    type: "pointer",
    name: "RPC Username",
    description: "The username for Bitcoin Core's RPC interface",
    subtype: "package",
    "package-id": "bitcoind",
    target: "config",
    multi: false,
    selector: "$.rpc.username",
  },
  password: {
    type: "pointer",
    name: "RPC Password",
    description: "The password for Bitcoin Core's RPC interface",
    subtype: "package",
    "package-id": "bitcoind",
    target: "config",
    multi: false,
    selector: "$.rpc.password",
  },
});
