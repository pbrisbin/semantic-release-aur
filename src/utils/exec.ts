import os from "os";
import { spawn } from "child_process";

export interface ExecLogger {
  log: (fmt: string, arg?: string) => void;
  error: (fmt: string, arg?: string) => void;
}

export const exec = (
  cmd: string,
  args: string[],
  logger: ExecLogger,
): Promise<number> => {
  return new Promise((resolve, reject) => {
    // All of the below is basically taken from @actions/exec
    const cp = spawn(cmd, args);

    let stdbuffer = "";
    if (cp.stdout) {
      cp.stdout.on("data", (data: Buffer) => {
        stdbuffer = _processLineBuffer(data, stdbuffer, (line: string) => {
          logger.log(line);
        });
      });
    }

    let errbuffer = "";
    if (cp.stderr) {
      cp.stderr.on("data", (data: Buffer) => {
        errbuffer = _processLineBuffer(data, errbuffer, (line: string) => {
          logger.log(line);
        });
      });
    }

    cp.on("error", (err: Error) => {
      logger.error(err.message);
      reject(err);
    });

    const finish = (code: number) => {
      if (stdbuffer.length > 0) {
        logger.log(stdbuffer);
      }

      if (errbuffer.length > 0) {
        logger.log(errbuffer);
      }

      resolve(code);
    };

    cp.on("exit", finish);
    cp.on("close", finish);
  });
};

function _processLineBuffer(
  data: Buffer,
  strBuffer: string,
  onLine: (line: string) => void,
): string {
  try {
    let s = strBuffer + data.toString();
    let n = s.indexOf(os.EOL);

    while (n > -1) {
      const line = s.substring(0, n);
      onLine(line);

      // the rest of the string ...
      s = s.substring(n + os.EOL.length);
      n = s.indexOf(os.EOL);
    }

    return s;
  } catch (err) {
    return "";
  }
}
