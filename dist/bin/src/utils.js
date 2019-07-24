"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const fs_1 = require("fs");
function delay(ms) {
    return new Promise(resolve => {
        setTimeout(() => {
            resolve();
        }, ms);
    });
}
exports.delay = delay;
function removeDynamicImports(sandboxPath) {
    const data = fs_1.readFileSync(sandboxPath, 'utf-8');
    const dataArray = data.split('\n');
    const getSandboxIndex = dataArray.findIndex(val => val.includes('getSandbox(path)'));
    const result = dataArray.slice(0, getSandboxIndex).join('\n');
    fs_1.writeFileSync(sandboxPath, result, { encoding: 'utf-8' });
}
exports.removeDynamicImports = removeDynamicImports;
