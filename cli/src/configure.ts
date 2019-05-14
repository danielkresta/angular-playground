import commander = require('commander');
import { resolve as resolvePath } from 'path';
import { existsSync } from 'fs';
import { REPORT_TYPE } from './error-reporter';

export interface Config {
    sourceRoots: string[];
    chunk: boolean;
    watch: boolean;
    serve: boolean;
    buildWithServiceWorkers: boolean;
    baseHref: string;

    verifySandboxes: boolean;
    randomScenario: boolean;
    timeout: number;
    reportType: string;
    reportPath: string;

    angularAppName?: string;
    angularCliPath?: string;
    angularCliPort?: number;
    angularCliAdditionalArgs?: string[];
    angularCliMaxBuffer?: number;
}

const splitCommaSeparatedList = (value) => {
    if (!value) {
        return ['./src/'];
    }
    return value.split(',');
};

export function configure(argv: any): Config {
    commander
        .name('angular-playground')
        .option('-C, --config <path>', 'Configuration file', './angular-playground.json')
        .option('-S, --src <path>', 'Specify component source directories (comma separated list)', splitCommaSeparatedList)

        // Build options
        .option('--no-watch', 'Disable sandboxes watch', false)
        .option('--no-serve', 'Disable cli serve', false)
        .option('--no-chunk', 'Don\'t chunk sandbox files individually', false)
        .option('--build', 'Build your sandboxes with service workers enabled. Requires @angular/service-worker', false)
        .option('--base-href <href>', 'Specify a base-href for @angular/cli build', '/')

        // Sandbox verification
        .option('--check-errors', 'Check for errors in all scenarios in all sandboxes', false)
        .option('--random-scenario', 'Pick a random scenario from each sandbox to check for errors', false)
        .option('--timeout <n>', 'Number of attempts for each sandbox', 90)
        .option('--report-type <type>', 'Type of report to generate', REPORT_TYPE.LOG)
        .option('--report-path <path>', 'Path of report to generate', '')

        // @angular/cli options
        .option('--ng-cli-app <appName>', '@angular/cli appName')
        .option('--ng-cli-port <n>', '@angular/cli serve port', 4201)
        .option('--ng-cli-cmd <path>', 'Path to @angular/cli executable', 'node_modules/@angular/cli/bin/ng')
        .option('--ng-cli-args <list>', 'Additional @angular/cli arguments')
        .option('--ng-cli-max-buffer <maxBuffer>', 'Specify a max buffer (for large apps)');

    commander.parse(argv);
    return applyConfigurationFile(commander);
}

export function applyConfigurationFile(program: any): Config {
    const playgroundConfig = loadConfig(program.config);

    const config: Config = {
        sourceRoots: playgroundConfig.sourceRoots || program.src,
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
        config.angularCliMaxBuffer = playgroundConfig.angularCli.maxBuffer || program.ngCliMaxBuffer;
    }

    return config;
}

function loadConfig(path: string) {
    const configPath = resolvePath(path);
    if (!existsSync(configPath)) {
        throw new Error(`Failed to load config file ${configPath}`);
    }

    return require(configPath.replace(/.json$/, ''));
}

function negate(value: boolean) {
    if (value === undefined) {
        return value;
    }

    return !value;
}
