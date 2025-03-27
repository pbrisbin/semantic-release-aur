"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.verifyConditions = verifyConditions;
const exec_1 = require("./utils/exec");
async function verifyConditions(_config, { logger }) {
    const { SSH_PRIVATE_KEY } = process.env;
    if (!SSH_PRIVATE_KEY) {
        throw new Error("SSH_PRIVATE_KEY must be set in the environment");
    }
    await checkBinary("updpkgsums", logger);
    await checkBinary("makepkg", logger);
    logger.success("Verify conditions done!");
}
async function checkBinary(cmd, logger) {
    const ec = await (0, exec_1.exec)("which", [cmd], logger);
    if (ec !== 0) {
        throw new Error(`Binary ${cmd} doesn't exist on $PATH, are you running on archlinux?`);
    }
}
//# sourceMappingURL=verifyConditions.js.map