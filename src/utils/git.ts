import fs from "fs";
import os from "os";
import path from "path";

import { ExecLogger, execThrow } from "./exec";

export interface CloneOptions {
  domain: string;
  user: string;
  keyContents: string;
  repo: string;
}

export interface CommitOptions {
  message: string;
  paths: string[];
}

export class Git {
  private tmp: string;
  private logger: ExecLogger;

  constructor(tmp: string, logger: ExecLogger) {
    this.tmp = tmp;
    this.logger = logger;
  }

  public getCloneDirectory(repo: string): string {
    return path.join(this.tmp, repo);
  }

  public async clone(options: CloneOptions): Promise<string> {
    const { domain, user, keyContents, repo } = options;
    const url = `ssh://${user}@${domain}/${repo}`;
    const dir = this.getCloneDirectory(repo);
    const keyPath = path.join(this.tmp, `${repo}_id_rsa`);
    const configPath = path.join(os.homedir(), ".ssh", "config");
    const configLines = [
      "",
      `Host ${domain}`,
      `  IdentityFile ${keyPath}`,
      "  StrictHostKeyChecking no",
      "  UserKnownHostsFile /dev/null",
    ];

    this.mkdir_p(path.dirname(configPath));

    fs.writeFileSync(keyPath, keyContents);
    fs.appendFileSync(configPath, configLines.join("\n"));

    await execThrow("git", ["clone", url, dir], this.logger);

    return dir;
  }

  public async diff(): Promise<void> {
    await execThrow("git", ["diff"], this.logger);
  }

  public async commit(options: CommitOptions): Promise<void> {
    const { message, paths } = options;
    await execThrow(
      "git",
      ["commit", "-m", message, "--"].concat(paths),
      this.logger,
    );
  }

  public async push(): Promise<void> {
    await execThrow("git", ["push"], this.logger);
  }

  private mkdir_p(dir: string): void {
    const exists = fs.existsSync(dir);

    if (!exists) {
      fs.mkdirSync(dir);
    }
  }
}
