import fs from "fs";
import { PrepareContext } from "semantic-release";

import { RawPluginConfig, defaultConfig } from "./types/pluginConfig";
import { Git } from "./utils/git";

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

  // TODO: extract to utils/pkg
  replaceInFile("PKGBUILD", /^pkgver=.*$/, `pkgver=${version}`);
  replaceInFile("PKGBUILD", /^pkgrel=.*$/, "pkgrel=1");

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

function replaceInFile(path: string, re: RegExp, replacement: string) {
  const contents = fs.readFileSync(path, "utf-8");
  fs.writeFileSync(path, contents.replace(re, replacement));
}
