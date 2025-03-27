"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Git = void 0;
const tslib_1 = require("tslib");
const fs_1 = tslib_1.__importDefault(require("fs"));
const os_1 = tslib_1.__importDefault(require("os"));
const path_1 = tslib_1.__importDefault(require("path"));
const exec_1 = require("./exec");
class Git {
    tmp;
    logger;
    constructor(tmp, logger) {
        this.tmp = tmp;
        this.logger = logger;
    }
    getCloneDirectory(repo) {
        return path_1.default.join(this.tmp, repo);
    }
    async clone(options) {
        const { domain, user, keyContents, repo } = options;
        const url = `ssh://${user}@${domain}/${repo}`;
        const dir = this.getCloneDirectory(repo);
        const keyPath = path_1.default.join(this.tmp, `${repo}_id_rsa`);
        const configPath = path_1.default.join(os_1.default.homedir(), ".ssh", "config");
        const configLines = [
            "",
            `Host ${domain}`,
            `  IdentityFile ${keyPath}`,
            "  StrictHostKeyChecking no",
            "  UserKnownHostsFile /dev/null",
        ];
        this.mkdir_p(path_1.default.dirname(configPath));
        fs_1.default.writeFileSync(keyPath, keyContents);
        fs_1.default.appendFileSync(configPath, configLines.join("\n"));
        await (0, exec_1.execThrow)("git", ["clone", url, dir], this.logger);
        return dir;
    }
    async diff() {
        await (0, exec_1.execThrow)("git", ["diff"], this.logger);
    }
    async commit(options) {
        const { message, paths } = options;
        await (0, exec_1.execThrow)("git", ["commit", "-m", message, "--"].concat(paths), this.logger);
    }
    async push() {
        await (0, exec_1.execThrow)("git", ["push"], this.logger);
    }
    mkdir_p(dir) {
        const exists = fs_1.default.existsSync(dir);
        if (!exists) {
            fs_1.default.mkdirSync(dir);
        }
    }
}
exports.Git = Git;
//# sourceMappingURL=git.js.map