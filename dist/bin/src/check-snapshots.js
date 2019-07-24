"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const fs_1 = require("fs");
const puppeteer = require("puppeteer");
const path_1 = require("path");
const util_1 = require("util");
const child_process_1 = require("child_process");
const core_1 = require("@jest/core");
const utils_1 = require("./utils");
// Used to tailor the version of headless chromium ran by puppeteer
const CHROME_ARGS = ['--disable-gpu', '--no-sandbox'];
const SANDBOX_PATH = path_1.resolve(__dirname, '../../../dist/build/src/shared/sandboxes.js');
const SANDBOX_DEST = path_1.resolve(__dirname, '../../../sandboxes_modified.js');
const TEST_PATH = path_1.resolve(__dirname, '../../../dist/jest/test.js');
let browser;
// Ensure Chromium instances are destroyed on error
process.on('unhandledRejection', () => __awaiter(this, void 0, void 0, function* () {
    if (browser)
        yield browser.close();
}));
function checkSnapshots(config) {
    return __awaiter(this, void 0, void 0, function* () {
        fs_1.copyFileSync(SANDBOX_PATH, SANDBOX_DEST);
        utils_1.removeDynamicImports(SANDBOX_DEST);
        if (config.deleteSnapshots) {
            deleteSnapshots(config);
        }
        else {
            const hostUrl = `http://${config.angularCliHost}:${config.angularCliPort}`;
            writeSandboxesToTestFile(config, hostUrl);
            yield main(config, hostUrl);
        }
    });
}
exports.checkSnapshots = checkSnapshots;
/////////////////////////////////
function main(config, hostUrl) {
    return __awaiter(this, void 0, void 0, function* () {
        const timeoutAttempts = config.timeout;
        browser = yield puppeteer.launch({
            headless: true,
            handleSIGINT: false,
            args: CHROME_ARGS,
        });
        yield waitForNgServe(hostUrl, timeoutAttempts);
        const execAsync = util_1.promisify(child_process_1.exec);
        yield execAsync('cd node_modules/angular-playground');
        const argv = {
            config: 'node_modules/angular-playground/dist/jest/jest-puppeteer.config.js',
            updateSnapshot: !!config.updateSnapshots,
        };
        const projectPath = path_1.resolve('.');
        const projects = [projectPath];
        const { results } = yield core_1.runCLI(argv, projects);
        yield browser.close();
        const exitCode = results.numFailedTests === 0 ? 0 : 1;
        process.exit(exitCode);
    });
}
/**
 * Creates a Chromium page and navigates to the host url.
 * If Chromium is not able to connect to the provided page, it will issue a series
 * of retries before it finally fails.
 */
function waitForNgServe(hostUrl, timeoutAttempts) {
    return __awaiter(this, void 0, void 0, function* () {
        if (timeoutAttempts === 0) {
            yield browser.close();
            throw new Error('Unable to connect to Playground.');
        }
        const page = yield browser.newPage();
        try {
            yield page.goto(hostUrl);
            setTimeout(() => page.close()); // close page to prevent memory leak
        }
        catch (e) {
            yield page.close();
            yield utils_1.delay(1000);
            yield waitForNgServe(hostUrl, timeoutAttempts - 1);
        }
    });
}
function deleteSnapshots(config) {
    try {
        const normalizeResolvePath = (directory) => path_1.resolve('.', directory).replace(/\\/g, '/');
        const absoluteSnapshotDirectory = normalizeResolvePath(config.snapshotDirectory);
        const items = require(SANDBOX_DEST).getSandboxMenuItems();
        const buildIdentifier = (url) => {
            return decodeURIComponent(url)
                .substr(2)
                .replace(/[\/\.]|\s+/g, '-')
                .replace(/[^a-z0-9\-]/gi, '');
        };
        let filesDeleted = false;
        items.forEach((item) => {
            item.scenarioMenuItems.forEach((scenarioItem) => {
                if (item.key.includes(config.pathToSandboxes)) {
                    const url = `${encodeURIComponent(item.key)}/${encodeURIComponent(scenarioItem.description)}`;
                    const filePath = `${absoluteSnapshotDirectory}/${buildIdentifier(url)}-snap.png`;
                    if (fs_1.existsSync(filePath)) {
                        fs_1.unlinkSync(filePath);
                        console.log(`Deleted file: ${filePath}`);
                        filesDeleted = true;
                    }
                }
            });
        });
        if (!filesDeleted) {
            console.log('No snapshots were deleted.');
        }
    }
    catch (err) {
        throw new Error(`Failed to delete snapshots. ${err}`);
    }
}
function writeSandboxesToTestFile(config, hostUrl) {
    const normalizeResolvePath = (directory) => path_1.resolve('.', directory).replace(/\\/g, '/');
    const absoluteSnapshotDirectory = normalizeResolvePath(config.snapshotDirectory);
    const absoluteDiffDirectory = normalizeResolvePath(config.diffDirectory);
    try {
        const items = require(SANDBOX_DEST).getSandboxMenuItems();
        const testPaths = [];
        items.forEach((item) => {
            item.scenarioMenuItems.forEach((scenarioItem) => {
                if (item.key.includes(config.pathToSandboxes)) {
                    testPaths.push({
                        url: `${encodeURIComponent(item.key)}/${encodeURIComponent(scenarioItem.description)}`,
                        label: `${item.name} ${scenarioItem.description}`,
                    });
                }
            });
        }, []);
        const extraConfig = Object.keys(config.imageSnapshotConfig)
            .map(key => `${key}: ${JSON.stringify(config.imageSnapshotConfig[key])}`)
            .join(',');
        const result = `
          const tests = ${JSON.stringify(testPaths)};
          const buildIdentifier = (url) => {
            return decodeURIComponent(url)
                .substr(2)
                .replace(/[\\/\\.]|\\s+/g, '-')
                .replace(/[^a-z0-9\\-]/gi, '');
          };
          describe('Playground snapshot tests', () => {
            for (let i = 0; i < tests.length; i++) {
              const test = tests[i];
              it(\`should match \${test.label}\`, async () => {
                const url = \`${hostUrl}?scenario=\${test.url}\`;
                console.log(\`Checking [\${i + 1}/\${tests.length}]: \${url}\`);
                const page = await browser.newPage();
                await page.goto(url, {'waitUntil' : 'load'});;
                await page.waitFor(() => !!document.querySelector('playground-host'));
                const image = await page.screenshot({ fullPage: true });
                expect(image).toMatchImageSnapshot({
                    customSnapshotsDir: '${absoluteSnapshotDirectory}',
                    customDiffDir: '${absoluteDiffDirectory}',
                    customSnapshotIdentifier: () => buildIdentifier(test.url),
                    ${extraConfig}
                });
                page.close();
              }, 30000);
            }
          });
        `;
        fs_1.writeFileSync(TEST_PATH, result, { encoding: 'utf-8' });
    }
    catch (err) {
        throw new Error(`Failed to create snapshot test file. ${err}`);
    }
}
