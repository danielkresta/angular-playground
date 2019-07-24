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
const child_process_1 = require("child_process");
function serveAngularCli(config) {
    return __awaiter(this, void 0, void 0, function* () {
        const args = configureArguments(config);
        const ngServe = child_process_1.spawn('node', args);
        const write = (handler, data) => {
            const message = data.toString();
            handler.write(`[ng serve]: ${message}\n`);
        };
        ngServe.stdout.on('data', data => {
            write(process.stdout, data);
        });
        ngServe.stderr.on('data', data => {
            write(process.stderr, data);
        });
        return Promise.resolve();
    });
}
exports.serveAngularCli = serveAngularCli;
function configureArguments(config) {
    let args = [config.angularCliPath, 'serve', config.angularAppName];
    if (!config.angularAppName) {
        throw new Error(`Please provide Playground's appName in your angular-playground.json file.`);
    }
    args.push(`--host=${config.angularCliHost}`);
    args.push(`--port=${config.angularCliPort}`);
    args.push('--progress=false');
    if (config.angularCliAdditionalArgs) {
        args = args.concat(config.angularCliAdditionalArgs);
    }
    return args;
}
