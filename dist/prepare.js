"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.prepare = prepare;
const tslib_1 = require("tslib");
const pluginConfig_1 = require("./types/pluginConfig");
const env = tslib_1.__importStar(require("./utils/env"));
const git_1 = require("./utils/git");
const pkg_1 = require("./utils/pkg");
async function prepare(rawConfig, context) {
    const config = (0, pluginConfig_1.defaultConfig)(rawConfig);
    const { logger, nextRelease } = context;
    const { version } = nextRelease;
    const git = new git_1.Git(config.tempDirectory, logger);
    const dir = await git.clone({
        domain: "aur.archlinux.org",
        user: "aur",
        keyContents: env.get("SSH_PRIVATE_KEY"),
        repo: config.packageName,
    });
    process.chdir(dir);
    (0, pkg_1.updatePKGBUILDVersion)(version);
    await git.diff();
    logger.success("Prepare done!");
}
//# sourceMappingURL=prepare.js.map