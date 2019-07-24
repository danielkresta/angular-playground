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
const configure_1 = require("./configure");
const build_sandboxes_1 = require("./build-sandboxes");
const start_watch_1 = require("./start-watch");
const verify_sandboxes_1 = require("./check-errors/verify-sandboxes");
const find_port_1 = require("./check-errors/find-port");
const serve_angular_cli_1 = require("./serve-angular-cli");
const build_angular_cli_1 = require("./build-angular-cli");
function run() {
    return __awaiter(this, void 0, void 0, function* () {
        const config = configure_1.configure(process.argv);
        try {
            yield build_sandboxes_1.buildSandboxes(config.sourceRoot, config.chunk);
        }
        catch (err) {
            throw err;
        }
        if (config.buildWithServiceWorkers) {
            return yield build_angular_cli_1.buildAngularCli(config.angularAppName, config.baseHref);
        }
        if (config.verifySandboxes) {
            config.angularCliPort = yield find_port_1.findFirstFreePort('127.0.0.1', 7000, 9000);
        }
        if (config.watch || config.verifySandboxes) {
            start_watch_1.startWatch(config.sourceRoot, () => build_sandboxes_1.buildSandboxes(config.sourceRoot, config.chunk));
        }
        if (config.serve || config.verifySandboxes) {
            try {
                yield serve_angular_cli_1.serveAngularCli(config);
            }
            catch (err) {
                throw err;
            }
        }
        if (config.verifySandboxes) {
            try {
                yield verify_sandboxes_1.verifySandboxes(config);
            }
            catch (err) {
                throw err;
            }
        }
    });
}
exports.run = run;
