var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
import { Component, Inject, Input, NgModule, NgZone } from '@angular/core';
import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';
import { SandboxLoader } from '../shared/sandbox-loader';
import { BrowserModule } from '@angular/platform-browser';
import { MIDDLEWARE } from '../../lib/middlewares';
import { takeUntil } from 'rxjs/operators';
import { Subject } from 'rxjs';
let ScenarioComponent = class ScenarioComponent {
    constructor(zone, middleware) {
        this.zone = zone;
        this.middleware = middleware;
        /**
         * Collection of bootstrapped apps
         */
        this.activeApps = [];
        /**
         * Unsubscribe all subscriptions on component destroy
         */
        this.onDestroy = new Subject();
    }
    ngOnInit() {
        this.middleware
            .pipe(takeUntil(this.onDestroy))
            .subscribe(middlewares => this.activeMiddleware = middlewares);
    }
    ngOnChanges(changes) {
        if (changes.selectedSandboxAndScenarioKeys) {
            this.bootstrapSandbox(changes.selectedSandboxAndScenarioKeys.currentValue);
        }
    }
    ngOnDestroy() {
        this.onDestroy.next();
        // this cleans up the DOM when a sandboxed component is loaded and the search bar is then cleared
        if (this.activeApps.length > 0) {
            // destroy sandboxed app (doesn't remove it from the DOM though)
            const app = this.activeApps.pop();
            app.destroy();
            // remove the sandboxed component's element from the dom
            const hostElement = document.querySelector('playground-host');
            if (hostElement && hostElement.children) {
                hostElement.children[0].remove();
            }
        }
    }
    /**
     * Bootstrap a new Angular application with the sandbox's required dependencies
     */
    bootstrapSandbox(selectedSandboxAndScenarioKeys) {
        SandboxLoader.loadSandbox(selectedSandboxAndScenarioKeys.sandboxKey).then(sandbox => {
            if (sandbox) {
                const scenario = sandbox.scenarios
                    .find((s) => s.key === selectedSandboxAndScenarioKeys.scenarioKey);
                if (scenario) {
                    if (this.activeApps.length > 0) {
                        const app = this.activeApps.pop();
                        app.destroy();
                    }
                    // Don't bootstrap a new Angular application within an existing zone
                    this.zone.runOutsideAngular(() => {
                        const module = this.createModule(sandbox, scenario);
                        platformBrowserDynamic().bootstrapModule(module)
                            .then(app => this.activeApps.push(app))
                            .catch(err => console.error(err));
                    });
                }
            }
        });
    }
    /**
     * Create a module containing the dependencies of a sandbox
     */
    createModule(sandboxMeta, scenario) {
        const hostComp = this.createComponent(scenario);
        class DynamicModule {
            ngDoBootstrap(app) {
                const hostEl = document.querySelector('playground-host');
                if (!hostEl) {
                    const compEl = document.createElement('playground-host');
                    // necessary change so that playground-host is a part of the ap-root and can be added to flexbox
                    document.body.children[0].appendChild(compEl);
                }
                app.bootstrap(hostComp);
            }
        }
        return NgModule({
            imports: [
                BrowserModule,
                ...sandboxMeta.imports,
                ...this.activeMiddleware.modules,
            ],
            declarations: [
                hostComp,
                sandboxMeta.declareComponent ? sandboxMeta.type : [],
                ...sandboxMeta.declarations,
            ],
            providers: [...sandboxMeta.providers],
            entryComponents: [hostComp, ...sandboxMeta.entryComponents],
            schemas: [...sandboxMeta.schemas],
        })(DynamicModule);
    }
    /**
     * Construct a component to serve as the host for the provided scenario
     */
    createComponent(scenario) {
        class DynamicComponent {
            constructor() {
                Object.assign(this, scenario.context);
            }
        }
        return Component({
            selector: 'playground-host',
            template: scenario.template,
            styles: scenario.styles,
            providers: scenario.providers,
        })(DynamicComponent);
    }
};
__decorate([
    Input(),
    __metadata("design:type", Object)
], ScenarioComponent.prototype, "selectedSandboxAndScenarioKeys", void 0);
ScenarioComponent = __decorate([
    Component({
        selector: 'ap-scenario',
        template: `<ng-template></ng-template>`,
    }),
    __param(1, Inject(MIDDLEWARE)),
    __metadata("design:paramtypes", [NgZone, Object])
], ScenarioComponent);
export { ScenarioComponent };
//# sourceMappingURL=scenario.component.js.map