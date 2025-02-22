import { exec } from "./exec";

class TestLogger {
  public readonly stdout: string[];
  public readonly stderr: string[];

  public constructor() {
    this.stdout = [];
    this.stderr = [];
  }

  public log(fmt: string, arg?: string): void {
    this.stdout.push(`${fmt}${arg ? ` ${arg}` : ""}`);
  }

  public error(fmt: string, arg?: string): void {
    this.stderr.push(`${fmt}${arg ? ` ${arg}` : ""}`);
  }
}

describe("exec", () => {
  it("executes a process and forwards lines to a logger", async () => {
    const logger = new TestLogger();
    const script = [
      "echo 'line 1'",
      "echo 'line 2'",
      "echo 'line 3' >&2",
      "echo 'line 4'",
      "echo 'line 5' >&2",
      "echo 'line 6' >&2",
    ].join("\n");
    const ec = await exec("sh", ["-c", script], logger);

    expect(ec).toEqual(0);
    expect(logger.stdout).toEqual([
      "line 1",
      "line 2",
      "line 4",
      "line 3", // race?
      "line 5",
      "line 6",
    ]);
    expect(logger.stderr).toEqual([]);
  });

  it("returns the exit code", async () => {
    const logger = new TestLogger();
    const ec = await exec("sh", ["-c", "exit 42"], logger);

    expect(ec).toEqual(42);
    expect(logger.stdout).toEqual([]);
    expect(logger.stderr).toEqual([]);
  });
});
