"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const program = require("commander");
const path_1 = require("path");
const fs_1 = require("fs");
const error_reporter_1 = require("./error-reporter");
function configure(argv) {
    program
        .name('angular-playground')
        .option('-C, --config <path>', 'Configuration file', './angular-playground.json')
        .option('-S, --src <path>', 'Specify component source directory', './src/')
        // Build options
        .option('--no-watch', 'Disable sandboxes watch', false)
        .option('--no-serve', 'Disable cli serve', false)
        .option('--no-chunk', 'Don\'t chunk sandbox files individually', false)
        .option('--build', 'Build your sandboxes with service workers enabled. Requires @angular/service-worker', false)
        .option('--base-href <href>', 'Specify a base-href for @angular/cli build', '/')
        // Sandbox verification
        .option('--check-errors', '', false)
        .option('--random-scenario', '', false)
        .option('--timeout', '', 90)
        .option('--report-type', '', error_reporter_1.REPORT_TYPE.LOG)
        .option('--report-path', '')
        // @angular/cli options
        .option('--ng-cli-app <appName>', '@angular/cli appName')
        .option('--ng-cli-port <n>', '@angular/cli serve port', 4201)
        .option('--ng-cli-cmd <path>', 'Path to @angular/cli executable', 'node_modules/@angular/cli/bin/ng')
        .option('--ng-cli-args <list>', 'Additional @angular/cli arguments');
    program.parse(argv);
    return applyConfigurationFile(program);
}
exports.configure = configure;
function applyConfigurationFile(program) {
    const playgroundConfig = loadConfig(program.config);
    const config = {
        sourceRoot: playgroundConfig.sourceRoot || program.src,
        chunk: negate(playgroundConfig.noChunk) || program.chunk,
        watch: negate(playgroundConfig.noWatch) || program.watch,
        serve: negate(playgroundConfig.noServe) || program.serve,
        buildWithServiceWorkers: playgroundConfig.build || program.build,
        baseHref: playgroundConfig.baseHref || program.baseHref,
        verifySandboxes: playgroundConfig.verifySandboxes || program.checkErrors,
        randomScenario: playgroundConfig.randomScenario || program.randomScenario,
        timeout: playgroundConfig.timeout || program.timeout,
        reportPath: playgroundConfig.reportPath || program.reportPath,
        reportType: playgroundConfig.reportType || program.reportType,
    };
    if (playgroundConfig.angularCli) {
        config.angularAppName = playgroundConfig.angularCli.appName || program.ngCliApp;
        config.angularCliPath = playgroundConfig.angularCli.cmdPath || program.ngCliCmd;
        config.angularCliPort = playgroundConfig.angularCli.port || program.ngCliPort;
        config.angularCliAdditionalArgs = playgroundConfig.angularCli.args || program.ngCliArgs;
    }
    return config;
}
exports.applyConfigurationFile = applyConfigurationFile;
function loadConfig(path) {
    const configPath = path_1.resolve(path);
    if (!fs_1.existsSync(configPath)) {
        throw new Error(`Failed to load config file ${configPath}`);
    }
    return require(configPath.replace(/.json$/, ''));
}
function negate(value) {
    if (value === undefined) {
        return value;
    }
    return !value;
}
