import { writeFile, readFileSync } from 'fs';
import { join as joinPath, resolve as resolvePath } from 'path';
import { fromDir } from './from-dir';
import { StringBuilder } from './string-builder';

export interface SandboxFileInformation {
    key: string;
    searchKey: string;
    name: string;
    label: string;
    scenarioMenuItems: {
        key: number;
        description: string;
    }[];
}

export function buildSandboxes(srcPath: string, chunk: boolean): Promise<string> {
    const chunkMode = chunk ? 'lazy' : 'eager';
    const home = resolvePath(srcPath);
    const sandboxes = findSandboxes(home);
    const filePath = resolvePath(__dirname, '../../build/src/shared/sandboxes.js');
    const fileContent = buildSandboxFileContents(sandboxes, home, chunkMode);

    return new Promise((resolve, reject) => {
        writeFile(filePath, fileContent, err => {
            if (err) {
                reject(new Error('Unable to compile sandboxes.'));
            }
            console.log('Successfully compiled sandbox files.');
            resolve(filePath);
        });
    });
}

export function findSandboxes(home: string): SandboxFileInformation[] {
    const sandboxes = [];

    fromDir(home, /\.sandbox.ts$/, (filename) => {
        let sandboxPath = filename.replace(home, '.').replace(/.ts$/, '').replace(/\\/g, '/');
        const contents = readFileSync(filename, 'utf8');

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
                searchKey: `${typeName}${label}`,
                name: typeName,
                label: label,
                scenarioMenuItems,
            });
        }
    });

    return sandboxes;
}

export function buildSandboxFileContents(sandboxes: SandboxFileInformation[], home: string, chunkMode: string): string {
    const content = new StringBuilder();
    content.addLine(`function getSandboxMenuItems() {`);
    content.addLine(`return ${JSON.stringify(sandboxes)};`);
    content.addLine(`}`);
    content.addLine('exports.getSandboxMenuItems = getSandboxMenuItems;');

    content.addLine(`function getSandbox(path) {`);
    content.addLine(`switch(path) {`);

    sandboxes.forEach(({ key }, i) => {
        let fullPath = joinPath(home, key);
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

// Turns windows URL string ('c:\\etc\\') into URL node expects ('c:/etc/')
// https://github.com/sindresorhus/slash
export function slash(input: string) {
    const isExtendedLengthPath = /^\\\\\?\\/.test(input);
    const hasNonAscii = /[^\u0000-\u0080]+/.test(input);

    if (isExtendedLengthPath || hasNonAscii) {
        return input;
    }

    return input.replace(/\\/g, '/');
}
