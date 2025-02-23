import fs from "fs";

import { ExecLogger, execThrow } from "./exec";

export function updatePKGBUILDVersion(version: string): void {
  replaceInFile("PKGBUILD", /^pkgver=.*$/, `pkgver=${version}`);
  replaceInFile("PKGBUILD", /^pkgrel=.*$/, "pkgrel=1");
}

export async function updatePKGBUILDChecksums(
  logger: ExecLogger,
): Promise<void> {
  await execThrow("updpkgsums", [], logger);
}

export async function updateSRCINFO(logger: ExecLogger): Promise<void> {
  await execThrow("sh", ["-c", "makepkg --printsrcinfo >.SRCINFO"], logger);
}

function replaceInFile(path: string, re: RegExp, replacement: string) {
  const contents = fs.readFileSync(path, "utf-8");
  fs.writeFileSync(path, contents.replace(re, replacement));
}
