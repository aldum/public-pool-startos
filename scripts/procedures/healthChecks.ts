import { types as T } from "../deps.ts";
// import { getConfig } from "./getConfig.ts";

export const health: T.ExpectedExports.health = {
  // deno-lint-ignore require-await
  async "web"(effects, duration) {
    return healthWeb(effects, duration).catch(e => {
      effects.error(`Error in web health check: ${e}`);
      return errorCode(60, "Starting");
    });
  },
};

const healthWeb: T.ExpectedExports.health[""] = async (effects, duration) => {
  await guardDurationAboveMinimum({ duration, minimumTime: 5000 });

  return await effects.fetch("http://pubpool.embassy")
    .then((_) => ok)
    .catch((e) => {
      effects.error(`${e}`)
      return error(`The UI is unreachable`)
    });
};

// Ensure the starting duration is past a minimum
const guardDurationAboveMinimum = (
  input: { duration: number; minimumTime: number },
) =>
  (input.duration <= input.minimumTime)
    ? Promise.reject(errorCode(60, "Starting"))
    : null;

const errorCode = (code: number, error: string) => ({
  "error-code": [code, error] as const,
});
const error = (error: string) => ({ error });
const ok = { result: null };
