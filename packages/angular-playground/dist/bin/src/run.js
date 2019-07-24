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
const getPort = require("get-port");
const configure_1 = require("./configure");
const build_sandboxes_1 = require("./build-sandboxes");
const start_watch_1 = require("./start-watch");
const verify_sandboxes_1 = require("./check-errors/verify-sandboxes");
const serve_angular_cli_1 = require("./serve-angular-cli");
const build_angular_cli_1 = require("./build-angular-cli");
const check_snapshots_1 = require("./check-snapshots");
function run() {
    return __awaiter(this, void 0, void 0, function* () {
        const config = configure_1.configure(process.argv);
        try {
            yield build_sandboxes_1.buildSandboxes(config.sourceRoots, config.chunk);
        }
        catch (err) {
            throw err;
        }
        if (config.buildWithServiceWorkers) {
            return yield build_angular_cli_1.buildAngularCli(config.angularAppName, config.baseHref, config.angularCliMaxBuffer);
        }
        if (config.verifySandboxes || (config.checkVisualRegressions && !config.deleteSnapshots)) {
            config.angularCliPort = yield getPort({ host: config.angularCliHost });
        }
        if ((config.watch && !config.deleteSnapshots) || config.verifySandboxes || (config.checkVisualRegressions && !config.deleteSnapshots)) {
            start_watch_1.startWatch(config.sourceRoots, () => build_sandboxes_1.buildSandboxes(config.sourceRoots, config.chunk));
        }
        if ((config.serve && !config.deleteSnapshots) || config.verifySandboxes || (config.checkVisualRegressions && !config.deleteSnapshots)) {
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
        if (config.checkVisualRegressions) {
            try {
                yield check_snapshots_1.checkSnapshots(config);
            }
            catch (err) {
                throw err;
            }
        }
    });
}
exports.run = run;
