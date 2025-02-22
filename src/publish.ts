import { PublishContext } from "semantic-release";

import { RawPluginConfig, defaultConfig } from "./types/pluginConfig";
import { execThrow } from "./utils/exec";
import { Git } from "./utils/git";

export const publish = async (
  rawConfig: RawPluginConfig,
  context: PublishContext,
): Promise<void> => {
  const config = defaultConfig(rawConfig);
  const { logger } = context;

  const git = new Git(config.tempDirectory, logger);
  const dir = git.getCloneDirectory(config.packageName);
  process.chdir(dir);

  // TODO: extract to utils/pkg
  await execThrow("updpkgsums", [], logger);
  await execThrow("sh", ["-c", "makepkg --printsrcinfo >.SRCINFO"], logger);

  await git.diff();
  await git.commit({
    message: `Release v${context.nextRelease.version}`,
    paths: ["PKGBUILD", ".SRCINFO"],
  });

  if (!context.branch.prerelease || config.pushPrerelease) {
    await git.push();
  }

  logger.success("Pushed updated package to AUR");
};
