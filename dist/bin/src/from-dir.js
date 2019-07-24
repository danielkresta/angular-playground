"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const fs_1 = require("fs");
const path_1 = require("path");
function fromDirMultiple(startPaths, filter, callback) {
    for (const path of startPaths) {
        fromDir(path, path, filter, callback);
    }
}
exports.fromDirMultiple = fromDirMultiple;
/**
 * Recursively apply callback to files in a directory (and sub-directories) that match the
 * provided regular expression
 */
function fromDir(rootPath, startPath, filter, callback) {
    if (!fs_1.existsSync(startPath)) {
        throw new Error(`No Directory Found: ${startPath}`);
    }
    const files = fs_1.readdirSync(startPath);
    for (let i = 0; i < files.length; i++) {
        const filename = path_1.join(startPath, files[i]);
        const stat = fs_1.lstatSync(filename);
        if (stat.isDirectory()) {
            fromDir(rootPath, filename, filter, callback);
        }
        else if (filter.test(filename)) {
            callback(filename, rootPath);
        }
    }
}
