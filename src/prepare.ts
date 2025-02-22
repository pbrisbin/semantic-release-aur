import path from "path";
import { PrepareContext } from "semantic-release";

import { RawPluginConfig, defaultConfig } from "./types/pluginConfig";
import { ExecLogger, exec, execThrow } from "./utils/exec";

export async function prepare(
  rawConfig: RawPluginConfig,
  context: PrepareContext,
): Promise<void> {
  const config = defaultConfig(rawConfig);
  const { logger } = context;

  // await configureSSH(env.SSH_PUBLIC_KEY, logger)

  await cloneAUR(config.tempDirectory, config.packageName, logger);

  // await updatePKGBUILD(logger)

  // await updateSRCINFO(logger)

  await exec("git", ["diff"], logger);

  logger.success("Prepare done!");
}

const AUR = "ssh://aur@aur.archlinux.org";

async function cloneAUR(
  tmp: string,
  name: string,
  logger: ExecLogger,
): Promise<void> {
  const url = `${AUR}/${name}`;
  const dir = path.join(tmp, name);
  await execThrow("git", ["clone", url, dir], logger);
}
