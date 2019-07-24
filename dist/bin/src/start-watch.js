"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const path_1 = require("path");
const node_watch_1 = require("node-watch");
function startWatch(sourceRoots, cb) {
    const filter = (fn) => {
        return (evt, filename) => {
            if (!/node_modules/.test(filename) && /\.sandbox.ts$/.test(filename)) {
                fn(filename);
            }
        };
    };
    sourceRoots.forEach(sourceRoot => node_watch_1.default(path_1.resolve(sourceRoot), { recursive: true }, filter(cb)));
}
exports.startWatch = startWatch;
