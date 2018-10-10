"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const path_1 = require("path");
const watch = require("node-watch");
function startWatch(sourceRoot, cb) {
    const filter = (fn) => {
        return (evt, filename) => {
            if (!/node_modules/.test(filename) && /\.sandbox.ts$/.test(filename)) {
                fn(filename);
            }
        };
    };
    watch([path_1.resolve(sourceRoot)], { recursive: true }, filter(cb));
}
exports.startWatch = startWatch;
