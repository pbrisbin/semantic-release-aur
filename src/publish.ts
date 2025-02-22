import path from "path";
import { PublishContext } from "semantic-release";

import { RawPluginConfig, defaultConfig } from "./types/pluginConfig";
import { execThrow } from "./utils/exec";

export const publish = async (
  rawConfig: RawPluginConfig,
  context: PublishContext,
): Promise<void> => {
  const config = defaultConfig(rawConfig);
  const { logger } = context;

  const dir = path.join(config.tempDirectory, config.packageName, ".git");
  const git = async (...args: string[]): Promise<void> => {
    await execThrow("git", ["--git-dir", dir].concat(args), logger);
  };

  await git(
    "commit",
    "-m",
    `Release v${context.nextRelease.version}`,
    "PKGBUILD",
    ".SRCINFO",
  );

  if (!context.branch.prerelease || config.pushPrerelease) {
    await git("push");
  }

  logger.success("Pushed updated package to AUR");
};
