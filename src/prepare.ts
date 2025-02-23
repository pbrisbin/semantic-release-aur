import { PrepareContext } from "semantic-release";

import { RawPluginConfig, defaultConfig } from "./types/pluginConfig";
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
    domain: AUR,
    user: "aur",
    keyContents: requireEnv("SSH_PRIVATE_KEY"),
    repo: config.packageName,
  });

  process.chdir(dir);

  updatePKGBUILDVersion(version);

  await git.diff();

  logger.success("Prepare done!");
}

const AUR = "aur.archlinux.org";

function requireEnv(key: string): string {
  const val = process.env[key];

  if (!val) {
    throw new Error(`Required environment variable ${key} not set`);
  }

  return val;
}
