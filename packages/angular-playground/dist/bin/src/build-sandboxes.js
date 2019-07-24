"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const fs_1 = require("fs");
const path_1 = require("path");
const from_dir_1 = require("./from-dir");
const string_builder_1 = require("./string-builder");
function buildSandboxes(srcPaths, chunk) {
    const chunkMode = chunk ? 'lazy' : 'eager';
    const homes = srcPaths.map(srcPath => path_1.resolve(srcPath));
    const sandboxes = findSandboxes(homes);
    const filePath = path_1.resolve(__dirname, '../../build/src/shared/sandboxes.js');
    const fileContent = buildSandboxFileContents(sandboxes, chunkMode);
    return new Promise((resolve, reject) => {
        fs_1.writeFile(filePath, fileContent, err => {
            if (err) {
                reject(new Error('Unable to compile sandboxes.'));
            }
            console.log('Successfully compiled sandbox files.');
            resolve(filePath);
        });
    });
}
exports.buildSandboxes = buildSandboxes;
function findSandboxes(homes) {
    const sandboxes = [];
    from_dir_1.fromDirMultiple(homes, /\.sandbox.ts$/, (filename, home) => {
        let sandboxPath = filename.replace(home, '.').replace(/.ts$/, '').replace(/\\/g, '/');
        const contents = fs_1.readFileSync(filename, 'utf8');
        const matchSandboxOf = /\s?sandboxOf\s*\(\s*([^)]+?)\s*\)/g.exec(contents);
        if (matchSandboxOf) {
            const typeName = matchSandboxOf[1].split(',')[0].trim();
            const labelText = /label\s*:\s*['"](.+)['"]/g.exec(matchSandboxOf[0]);
            let scenarioMenuItems = [];
            // Tested with https://regex101.com/r/mtp2Fy/2
            // First scenario: May follow directly after sandboxOf function ).add
            // Other scenarios: .add with possible whitespace before. Ignore outcommented lines.
            const scenarioRegex = /^(?!\/\/)(?:\s*|.*\))\.add\s*\(\s*['"](.+)['"]\s*,\s*{/gm;
            let scenarioMatches;
            let scenarioIndex = 1;
            while ((scenarioMatches = scenarioRegex.exec(contents)) !== null) {
                scenarioMenuItems.push({ key: scenarioIndex, description: scenarioMatches[1] });
                scenarioIndex++;
            }
            let label = labelText ? labelText[1] : '';
            sandboxes.push({
                key: sandboxPath,
                srcPath: home,
                searchKey: `${typeName}${label}`,
                name: typeName,
                label: label,
                scenarioMenuItems,
            });
        }
    });
    return sandboxes;
}
exports.findSandboxes = findSandboxes;
function buildSandboxFileContents(sandboxes, chunkMode) {
    const content = new string_builder_1.StringBuilder();
    content.addLine(`function getSandboxMenuItems() {`);
    content.addLine(`return ${JSON.stringify(sandboxes)};`);
    content.addLine(`}`);
    content.addLine('exports.getSandboxMenuItems = getSandboxMenuItems;');
    content.addLine(`function getSandbox(path) {`);
    content.addLine(`switch(path) {`);
    sandboxes.forEach(({ key, srcPath }, i) => {
        let fullPath = path_1.join(srcPath, key);
        // Normalize slash syntax for Windows/Unix filepaths
        fullPath = slash(fullPath);
        content.addLine(`case '${key}':`);
        content.addLine(`  return import( /* webpackMode: "${chunkMode}" */ '${fullPath}').then(function(_){ return _.default.serialize('${key}'); });`);
    });
    content.addLine(`}`);
    content.addLine(`}`);
    content.addLine('exports.getSandbox = getSandbox;');
    return content.dump();
}
exports.buildSandboxFileContents = buildSandboxFileContents;
// Turns windows URL string ('c:\\etc\\') into URL node expects ('c:/etc/')
// https://github.com/sindresorhus/slash
function slash(input) {
    const isExtendedLengthPath = /^\\\\\?\\/.test(input);
    const hasNonAscii = /[^\u0000-\u0080]+/.test(input);
    if (isExtendedLengthPath || hasNonAscii) {
        return input;
    }
    return input.replace(/\\/g, '/');
}
exports.slash = slash;
