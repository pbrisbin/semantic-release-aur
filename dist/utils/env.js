"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.get = get;
function get(key) {
    const val = process.env[key];
    if (!val) {
        throw new Error(`Required environment variable ${key} not set`);
    }
    return val;
}
//# sourceMappingURL=env.js.map