import { PublishContext } from "semantic-release";

import { RawPluginConfig, defaultConfig } from "./types/pluginConfig";
import { Git } from "./utils/git";
import { updatePKGBUILDChecksums, updateSRCINFO } from "./utils/pkg";

export const publish = async (
  rawConfig: RawPluginConfig,
  context: PublishContext,
): Promise<void> => {
  const config = defaultConfig(rawConfig);
  const { logger } = context;

  const git = new Git(config.tempDirectory, logger);
  const dir = git.getCloneDirectory(config.packageName);
  process.chdir(dir);

  await updatePKGBUILDChecksums(logger);
  await updateSRCINFO(logger);

  await git.diff();
  await git.commit({
    message: `Release v${context.nextRelease.version}`,
    paths: ["PKGBUILD", ".SRCINFO"],
  });

  if (!context.branch.prerelease || config.pushPrerelease) {
    logger.info("Pushing to AUR git repository");
    await git.push();
  }

  logger.success("Publish done!");
};
