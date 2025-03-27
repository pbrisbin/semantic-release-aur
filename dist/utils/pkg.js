"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.updatePKGBUILDVersion = updatePKGBUILDVersion;
exports.updatePKGBUILDChecksums = updatePKGBUILDChecksums;
exports.updateSRCINFO = updateSRCINFO;
const tslib_1 = require("tslib");
const fs_1 = tslib_1.__importDefault(require("fs"));
const exec_1 = require("./exec");
function updatePKGBUILDVersion(version) {
    replaceInFile("PKGBUILD", /^pkgver=.*$/m, `pkgver=${version}`);
    replaceInFile("PKGBUILD", /^pkgrel=.*$/m, "pkgrel=1");
}
async function updatePKGBUILDChecksums(logger) {
    await (0, exec_1.execThrow)("updpkgsums", [], logger);
}
async function updateSRCINFO(logger) {
    await (0, exec_1.execThrow)("sh", ["-c", "makepkg --printsrcinfo >.SRCINFO"], logger);
}
function replaceInFile(path, re, replacement) {
    const contents = fs_1.default.readFileSync(path, "utf-8");
    fs_1.default.writeFileSync(path, contents.replace(re, replacement));
}
//# sourceMappingURL=pkg.js.map