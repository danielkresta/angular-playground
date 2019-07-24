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
const puppeteer = require("puppeteer");
const path_1 = require("path");
const chalk_1 = require("chalk");
const fs_1 = require("fs");
const error_reporter_1 = require("../error-reporter");
const utils_1 = require("../utils");
// Used to tailor the version of headless chromium ran by puppeteer
const CHROME_ARGS = ['--disable-gpu', '--no-sandbox'];
const SANDBOX_PATH = path_1.resolve(__dirname, '../../../build/src/shared/sandboxes.js');
const SANDBOX_DEST = path_1.resolve(__dirname, '../../../sandboxes_modified.js');
let browser;
let currentScenario = '';
let currentScenarioDescription = '';
let reporter;
let hostUrl = '';
// Ensure Chromium instances are destroyed on error
process.on('unhandledRejection', () => {
    if (browser)
        browser.close();
});
function verifySandboxes(config) {
    return __awaiter(this, void 0, void 0, function* () {
        hostUrl = `http://localhost:${config.angularCliPort}`;
        fs_1.copyFileSync(SANDBOX_PATH, SANDBOX_DEST);
        utils_1.removeDynamicImports(SANDBOX_DEST);
        yield main(config);
    });
}
exports.verifySandboxes = verifySandboxes;
/////////////////////////////////
function main(config) {
    return __awaiter(this, void 0, void 0, function* () {
        const timeoutAttempts = config.timeout;
        browser = yield puppeteer.launch({
            headless: true,
            handleSIGINT: false,
            args: CHROME_ARGS,
        });
        const scenarios = getSandboxMetadata(hostUrl, config.randomScenario);
        reporter = new error_reporter_1.ErrorReporter(scenarios, config.reportPath, config.reportType);
        console.log(`Retrieved ${scenarios.length} scenarios.\n`);
        for (let i = 0; i < scenarios.length; i++) {
            console.log(`Checking [${i + 1}/${scenarios.length}]: ${scenarios[i].name}: ${scenarios[i].description}`);
            yield openScenarioInNewPage(scenarios[i], timeoutAttempts);
        }
        browser.close();
        const hasErrors = reporter.errors.length > 0;
        // always generate report if report type is a file, or if there are errors
        if (hasErrors || config.reportType !== error_reporter_1.REPORT_TYPE.LOG) {
            reporter.compileReport();
        }
        const exitCode = hasErrors ? 1 : 0;
        process.exit(exitCode);
    });
}
/**
 * Creates a Chromium page and navigates to a scenario (URL).
 * If Chromium is not able to connect to the provided page, it will issue a series
 * of retries before it finally fails.
 */
function openScenarioInNewPage(scenario, timeoutAttempts) {
    return __awaiter(this, void 0, void 0, function* () {
        if (timeoutAttempts === 0) {
            yield browser.close();
            throw new Error('Unable to connect to Playground.');
        }
        const page = yield browser.newPage();
        page.on('console', (msg) => onConsoleErr(msg));
        currentScenario = scenario.name;
        currentScenarioDescription = scenario.description;
        try {
            yield page.goto(scenario.url);
            setTimeout(() => page.close(), 10000); // close page after 10s to prevent memory leak
        }
        catch (e) {
            yield page.close();
            yield utils_1.delay(1000);
            yield openScenarioInNewPage(scenario, timeoutAttempts - 1);
        }
    });
}
/**
 * Retrieves Sandbox scenario URLs, descriptions, and names
 * @param baseUrl - Base URL of scenario path e.g. http://localhost:4201
 * @param selectRandomScenario - Whether or not to select one random scenario of all availalble scenarios for a component
 */
function getSandboxMetadata(baseUrl, selectRandomScenario) {
    const scenarios = [];
    loadSandboxMenuItems().forEach((scenario) => {
        if (selectRandomScenario) {
            const randomItemKey = getRandomKey(scenario.scenarioMenuItems.length);
            for (const item of scenario.scenarioMenuItems) {
                if (item.key === randomItemKey) {
                    const url = `${baseUrl}?scenario=${encodeURIComponent(scenario.key)}/${encodeURIComponent(item.description)}`;
                    scenarios.push({ url, name: scenario.key, description: item.description });
                    break;
                }
            }
        }
        else {
            // Grab all scenarios
            scenario.scenarioMenuItems
                .forEach((item) => {
                const url = `${baseUrl}?scenario=${encodeURIComponent(scenario.key)}/${encodeURIComponent(item.description)}`;
                scenarios.push({ url, name: scenario.key, description: item.description });
            });
        }
    });
    return scenarios;
}
/**
 * Attempt to load sandboxes.ts and provide menu items
 */
function loadSandboxMenuItems() {
    try {
        return require(SANDBOX_DEST).getSandboxMenuItems();
    }
    catch (err) {
        throw new Error(`Failed to load sandbox menu items. ${err}`);
    }
}
/**
 * Callback when Chromium page encounters a console error
 */
function onConsoleErr(msg) {
    if (msg.type() === 'error') {
        console.error(chalk_1.default.red(`Error in ${currentScenario} (${currentScenarioDescription}):`));
        const getErrors = (type, getValue) => msg.args()
            .map(a => a._remoteObject)
            .filter(o => o.type === type)
            .map(getValue);
        const stackTrace = getErrors('object', o => o.description);
        const errorMessage = getErrors('string', o => o.value);
        const description = stackTrace.length ? stackTrace : errorMessage;
        description.map(d => console.error(d));
        if (description.length) {
            reporter.addError(description, currentScenario, currentScenarioDescription);
        }
    }
}
/**
 * Returns a random value between 1 and the provided length (both inclusive).
 * Note: indexing of keys starts at 1, not 0
 */
function getRandomKey(menuItemsLength) {
    return Math.floor(Math.random() * menuItemsLength) + 1;
}
