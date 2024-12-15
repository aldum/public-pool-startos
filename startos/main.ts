import { sdk } from "./sdk";
import { T } from "@start9labs/start-sdk";
// import { stratPort, uiPort } from "./utils";
import { stratPort } from "./utils";

export const main = sdk.setupMain(async ({ effects, started }) => {
  /**
   * ======================== Setup (optional) ========================
   *
   * In this section, we fetch any resources or run any desired preliminary commands.
   */
  console.info("Starting...");
  /**
   * ======================== Additional Health Checks (optional) ========================
   *
   * In this section, we define *additional* health checks beyond those included with each daemon (below).
   */
  const healthReceipts: T.HealthReceipt[] = [];

  // const { PUBPOOL__server__ROOT_URL } = await sdk.store.getOwn(
  //   effects,
  //   sdk.StorePath,
  // ).const();
  // const env: PubPoolEnv = {
  //   PUBPOOL__server__ROOT_URL,
  // };
  /**
   * ======================== Daemons ========================
   *
   * In this section, we create one or more daemons that define the service runtime.
   *
   * Each daemon defines its own health check, which can optionally be exposed to the user.
   */
  const daemons = sdk.Daemons.of(effects, started, healthReceipts);
  // daemons.addDaemon(
  //   "frontend",
  //   {
  //     image: { id: "frontend" },
  //     command: ["/bin/sh", "/entrypoint.sh"],
  //     env,
  //     mounts: sdk.Mounts.of().addVolume("frontend", null, "/data", false),
  //     ready: {
  //       display: "Web Interface",
  //       fn: () =>
  //         sdk.healthCheck.checkPortListening(effects, uiPort, {
  //           successMessage: "Server is ready",
  //           errorMessage:
  //             "Server is experiencing an issue. Please check the logs.",
  //         }),
  //     },
  //     requires: [],
  //   },
  // );

  daemons.addDaemon(
    "primary",
    {
      image: { id: "backend" },
      command: ["/usr/local/bin/node", "dist/main"],
      // env,
      mounts: sdk.Mounts.of().addVolume("backend", null, "/data", false),
      ready: {
        display: "Stratum Interface",
        fn: () =>
          sdk.healthCheck.checkPortListening(effects, stratPort, {
            successMessage: "Server is ready",
            errorMessage:
              "Server is experiencing an issue. Please check the logs.",
          }),
      },
      requires: [],
    },
  );

  return daemons;
});

// type PubPoolEnv = {
//   PUBPOOL__server__ROOT_URL: string;
// };
