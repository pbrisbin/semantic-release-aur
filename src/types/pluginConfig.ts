import os from "os";
import path from "path";

export interface RawPluginConfig {
  tempDirectory?: string;
  packageName?: string;
  pushPrerelease?: boolean;
}

export type PluginConfig = {
  tempDirectory: string;
  packageName: string;
  pushPrerelease: boolean;
};

export function defaultConfig(raw: RawPluginConfig): PluginConfig {
  return {
    tempDirectory: raw.tempDirectory ?? os.tmpdir(),
    packageName: raw.packageName ?? path.basename(process.cwd()),
    pushPrerelease: raw.pushPrerelease ?? false,
  };
}
