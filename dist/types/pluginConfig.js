"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.defaultConfig = defaultConfig;
const tslib_1 = require("tslib");
const os_1 = tslib_1.__importDefault(require("os"));
const path_1 = tslib_1.__importDefault(require("path"));
function defaultConfig(raw) {
    return {
        tempDirectory: raw.tempDirectory ?? os_1.default.tmpdir(),
        packageName: raw.packageName ?? path_1.default.basename(process.cwd()),
        pushPrerelease: raw.pushPrerelease ?? false,
    };
}
//# sourceMappingURL=pluginConfig.js.map