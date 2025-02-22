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

  const dir = path.join(config.tempDirectory, config.packageName);
  process.chdir(dir);

  const git = async (...args: string[]): Promise<void> => {
    await execThrow("git", args, logger);
  };

  await execThrow("updpkgsums", [], logger);
  await execThrow("sh", ["-c", "makepkg --printsrcinfo >.SRCINFO"], logger);

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
