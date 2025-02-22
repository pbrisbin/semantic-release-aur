import path from "path";
import os from "os";
import { PrepareContext } from "semantic-release";

import { PluginConfig } from "./types/pluginConfig";
import { ExecLogger, exec, execThrow } from "./utils/exec";

export async function prepare(
  config: PluginConfig,
  context: PrepareContext,
): Promise<void> {
  const { logger } = context;
  const base = path.basename(process.cwd());

  // await configureSSH(env.SSH_PUBLIC_KEY, logger)

  await cloneAUR(
    config.tempDirectory ?? os.tmpdir(),
    config.packageName ?? base,
    logger,
  );

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
