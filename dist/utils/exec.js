"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.exec = exec;
exports.execThrow = execThrow;
const tslib_1 = require("tslib");
const os_1 = tslib_1.__importDefault(require("os"));
const child_process_1 = require("child_process");
async function exec(cmd, args, logger) {
    return new Promise((resolve, reject) => {
        // All of the below is basically taken from @actions/exec
        const cp = (0, child_process_1.spawn)(cmd, args);
        let stdbuffer = "";
        if (cp.stdout) {
            cp.stdout.on("data", (data) => {
                stdbuffer = _processLineBuffer(data, stdbuffer, (line) => {
                    logger.log(line);
                });
            });
        }
        let errbuffer = "";
        if (cp.stderr) {
            cp.stderr.on("data", (data) => {
                errbuffer = _processLineBuffer(data, errbuffer, (line) => {
                    logger.log(line);
                });
            });
        }
        cp.on("error", (err) => {
            logger.error(err.message);
            reject(err);
        });
        const finish = (code) => {
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
}
function _processLineBuffer(data, strBuffer, onLine) {
    try {
        let s = strBuffer + data.toString();
        let n = s.indexOf(os_1.default.EOL);
        while (n > -1) {
            const line = s.substring(0, n);
            onLine(line);
            // the rest of the string ...
            s = s.substring(n + os_1.default.EOL.length);
            n = s.indexOf(os_1.default.EOL);
        }
        return s;
    }
    catch (err) {
        return "";
    }
}
async function execThrow(cmd, args, logger) {
    const ec = await exec(cmd, args, logger);
    if (ec !== 0) {
        throw new Error(`${cmd} ${args.join(" ")} exited non-zero (${ec})`);
    }
}
//# sourceMappingURL=exec.js.map