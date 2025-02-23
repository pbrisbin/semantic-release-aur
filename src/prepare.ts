import { PrepareContext } from "semantic-release";

import { RawPluginConfig, defaultConfig } from "./types/pluginConfig";
import * as env from "./utils/env";
import { Git } from "./utils/git";
import { updatePKGBUILDVersion } from "./utils/pkg";

export async function prepare(
  rawConfig: RawPluginConfig,
  context: PrepareContext,
): Promise<void> {
  const config = defaultConfig(rawConfig);
  const { logger, nextRelease } = context;
  const { version } = nextRelease;
  const git = new Git(config.tempDirectory, logger);
  const dir = await git.clone({
    domain: "aur.archlinux.org",
    user: "aur",
    keyContents: env.get("SSH_PRIVATE_KEY"),
    repo: config.packageName,
  });

  process.chdir(dir);

  updatePKGBUILDVersion(version);

  await git.diff();

  logger.success("Prepare done!");
}
