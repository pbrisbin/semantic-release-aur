import { BaseContext } from "semantic-release";

import { RawPluginConfig } from "./types/pluginConfig";
import { ExecLogger, exec } from "./utils/exec";

export async function verifyConditions(
  _config: RawPluginConfig,
  { logger }: BaseContext,
): Promise<void> {
  const { SSH_PRIVATE_KEY } = process.env;

  if (!SSH_PRIVATE_KEY) {
    throw new Error("SSH_PRIVATE_KEY must be set in the environment");
  }

  await checkBinary("updpkgsums", logger);
  await checkBinary("makepkg", logger);

  logger.success("Verify conditions done!");
}

async function checkBinary(cmd: string, logger: ExecLogger): Promise<void> {
  const ec = await exec("which", [cmd], logger);

  if (ec !== 0) {
    throw new Error(
      `Binary ${cmd} doesn't exist on $PATH, are you running on archlinux?`,
    );
  }
}
