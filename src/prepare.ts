import fs from "fs";
import path from "path";
import os from "os";
import { PrepareContext } from "semantic-release";

import { RawPluginConfig, defaultConfig } from "./types/pluginConfig";
import { ExecLogger, exec, execThrow } from "./utils/exec";

export async function prepare(
  rawConfig: RawPluginConfig,
  context: PrepareContext,
): Promise<void> {
  const config = defaultConfig(rawConfig);
  const { logger } = context;

  const home = requireEnv("HOME");
  const sshKey = requireEnv("SSH_PRIVATE_KEY");
  await configureSSH(path.join(home, ".ssh", "config"), sshKey);

  const dir = await cloneAUR(config.tempDirectory, config.packageName, logger);
  process.chdir(dir);

  // sed -i "s/^pkgver=.*$/pkgver=$version/" PKGBUILD
  // sed -i "s/^pkgrel=.*$/pkgrel=1/" PKGBUILD

  await exec("git", ["diff"], logger);

  logger.success("Prepare done!");
}

const AUR = "aur.archlinux.org";

async function configureSSH(configPath: string, keyContents: string) {
  const keyPath = path.join(os.tmpdir(), "aur_id_rsa");
  const configLines = ["", `Host ${AUR}`, `  IdentityFile ${keyPath}`];

  fs.writeFileSync(keyPath, keyContents);
  fs.appendFileSync(configPath, configLines.join("\n"));
}

async function cloneAUR(
  tmp: string,
  name: string,
  logger: ExecLogger,
): Promise<string> {
  const url = `ssh://aur@${AUR}/${name}`;
  const dir = path.join(tmp, name);
  await execThrow("git", ["clone", url, dir], logger);
  return dir;
}

function requireEnv(key: string): string {
  const val = process.env[key];

  if (!val) {
    throw new Error(`Required environment variable ${key} not set`);
  }

  return val;
}
