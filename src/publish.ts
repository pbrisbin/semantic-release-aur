import path from "path";
import os from "os";
import { PublishContext } from "semantic-release";

import { PluginConfig } from "./types/pluginConfig";
import { execThrow } from "./utils/exec";

export const publish = async (
  config: PluginConfig,
  context: PublishContext,
): Promise<void> => {
  const name = config.packageName ?? path.basename(process.cwd());
  const dir = path.join(config.tempDirectory ?? os.tmpdir(), name);
  const { logger } = context;
  await execThrow("git", ["--git-dir", dir, "push"], logger);
  logger.success("Pushed updated package to AUR");
};
