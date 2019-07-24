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
function buildAngularCli(appName, baseHref, maxBuffer) {
    return __awaiter(this, void 0, void 0, function* () {
        let isInstalled = yield serviceWorkerIsInstalled();
        if (!isInstalled) {
            throw new Error('\n\nError: --build requires @angular/service-worker to be installed locally: \n' +
                'try running "npm install @angular/service-worker" then run "angular-playground --build" \n' +
                'see docs: https://github.com/angular/angular-cli/wiki/build#service-worker\n\n');
        }
        console.log('Building for production with sandboxes...');
        const options = Number.isInteger(+maxBuffer) ? { maxBuffer: +maxBuffer } : {};
        // Cannot build w/ AOT due to runtime compiler dependency
        child_process_1.exec(`ng build ${appName} --prod --aot=false --base-href=${baseHref}`, options, (err, stdout, stderr) => {
            if (err)
                throw err;
            console.log(stdout);
        });
    });
}
exports.buildAngularCli = buildAngularCli;
function serviceWorkerIsInstalled() {
    return __awaiter(this, void 0, void 0, function* () {
        return new Promise((resolve, reject) => {
            try {
                // Check package is installed (prod)
                require.resolve('@angular/service-worker');
                resolve(true);
            }
            catch (err) {
                try {
                    // Check package is installed (dev)
                    require.resolve('../../../../../examples/cli-example/node_modules/@angular/service-worker');
                    resolve(true);
                }
                catch (err2) {
                    resolve(false);
                }
            }
        });
    });
}
