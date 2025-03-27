"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.publish = void 0;
const pluginConfig_1 = require("./types/pluginConfig");
const git_1 = require("./utils/git");
const pkg_1 = require("./utils/pkg");
const publish = async (rawConfig, context) => {
    const config = (0, pluginConfig_1.defaultConfig)(rawConfig);
    const { logger } = context;
    const git = new git_1.Git(config.tempDirectory, logger);
    const dir = git.getCloneDirectory(config.packageName);
    process.chdir(dir);
    await (0, pkg_1.updatePKGBUILDChecksums)(logger);
    await (0, pkg_1.updateSRCINFO)(logger);
    await git.diff();
    await git.commit({
        message: `Release v${context.nextRelease.version}`,
        paths: ["PKGBUILD", ".SRCINFO"],
    });
    if (!context.branch.prerelease || config.pushPrerelease) {
        logger.info("Pushing to AUR git repository");
        await git.push();
    }
    logger.success("Publish done!");
};
exports.publish = publish;
//# sourceMappingURL=publish.js.map