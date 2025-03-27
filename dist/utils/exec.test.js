"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const exec_1 = require("./exec");
class TestLogger {
    stdout;
    stderr;
    constructor() {
        this.stdout = [];
        this.stderr = [];
    }
    log(fmt, arg) {
        this.stdout.push(`${fmt}${arg ? ` ${arg}` : ""}`);
    }
    error(fmt, arg) {
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
        const ec = await (0, exec_1.exec)("sh", ["-c", script], logger);
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
        const ec = await (0, exec_1.exec)("sh", ["-c", "exit 42"], logger);
        expect(ec).toEqual(42);
        expect(logger.stdout).toEqual([]);
        expect(logger.stderr).toEqual([]);
    });
});
//# sourceMappingURL=exec.test.js.map