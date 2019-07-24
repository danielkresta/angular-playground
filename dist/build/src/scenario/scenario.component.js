import { Component, Inject, Input, NgModule, NgZone } from '@angular/core';
import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';
import { SandboxLoader } from '../shared/sandbox-loader';
import { BrowserModule } from '@angular/platform-browser';
import { MIDDLEWARE } from '../../lib/middlewares';
import { takeUntil } from 'rxjs/operators';
import { Subject } from 'rxjs';
var ScenarioComponent = /** @class */ (function () {
    function ScenarioComponent(zone, middleware) {
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
    ScenarioComponent.prototype.ngOnInit = function () {
        var _this = this;
        this.middleware
            .pipe(takeUntil(this.onDestroy))
            .subscribe(function (middlewares) { return _this.activeMiddleware = middlewares; });
    };
    ScenarioComponent.prototype.ngOnChanges = function (changes) {
        if (changes.selectedSandboxAndScenarioKeys) {
            this.bootstrapSandbox(changes.selectedSandboxAndScenarioKeys.currentValue);
        }
    };
    ScenarioComponent.prototype.ngOnDestroy = function () {
        this.onDestroy.next();
        // this cleans up the DOM when a sandboxed component is loaded and the search bar is then cleared
        if (this.activeApps.length > 0) {
            // destroy sandboxed app (doesn't remove it from the DOM though)
            var app = this.activeApps.pop();
            app.destroy();
            // remove the sandboxed component's element from the dom
            var hostElement = document.querySelector('playground-host');
            if (hostElement && hostElement.children) {
                hostElement.children[0].remove();
            }
        }
    };
    /**
     * Bootstrap a new Angular application with the sandbox's required dependencies
     */
    ScenarioComponent.prototype.bootstrapSandbox = function (selectedSandboxAndScenarioKeys) {
        var _this = this;
        SandboxLoader.loadSandbox(selectedSandboxAndScenarioKeys.sandboxKey).then(function (sandbox) {
            if (sandbox) {
                var scenario_1 = sandbox.scenarios
                    .find(function (s) { return s.key === selectedSandboxAndScenarioKeys.scenarioKey; });
                if (scenario_1) {
                    if (_this.activeApps.length > 0) {
                        var app = _this.activeApps.pop();
                        app.destroy();
                    }
                    // Don't bootstrap a new Angular application within an existing zone
                    _this.zone.runOutsideAngular(function () {
                        var module = _this.createModule(sandbox, scenario_1);
                        platformBrowserDynamic().bootstrapModule(module)
                            .then(function (app) { return _this.activeApps.push(app); })
                            .catch(function (err) { return console.error(err); });
                    });
                }
            }
        });
    };
    /**
     * Create a module containing the dependencies of a sandbox
     */
    ScenarioComponent.prototype.createModule = function (sandboxMeta, scenario) {
        var hostComp = this.createComponent(scenario);
        var DynamicModule = /** @class */ (function () {
            function DynamicModule() {
            }
            DynamicModule.prototype.ngDoBootstrap = function (app) {
                var hostEl = document.querySelector('playground-host');
                if (!hostEl) {
                    var compEl = document.createElement('playground-host');
                    // necessary change so that playground-host is a part of the ap-root and can be added to flexbox
                    document.body.children[0].appendChild(compEl);
                }
                app.bootstrap(hostComp);
            };
            return DynamicModule;
        }());
        return NgModule({
            imports: [
                BrowserModule
            ].concat(sandboxMeta.imports, this.activeMiddleware.modules),
            declarations: [
                hostComp,
                sandboxMeta.declareComponent ? sandboxMeta.type : []
            ].concat(sandboxMeta.declarations),
            providers: sandboxMeta.providers.slice(),
            entryComponents: [hostComp].concat(sandboxMeta.entryComponents),
            schemas: sandboxMeta.schemas.slice()
        })(DynamicModule);
    };
    /**
     * Construct a component to serve as the host for the provided scenario
     */
    ScenarioComponent.prototype.createComponent = function (scenario) {
        var DynamicComponent = /** @class */ (function () {
            function DynamicComponent() {
                Object.assign(this, scenario.context);
            }
            return DynamicComponent;
        }());
        return Component({
            selector: 'playground-host',
            template: scenario.template,
            styles: scenario.styles,
            providers: scenario.providers
        })(DynamicComponent);
    };
    ScenarioComponent.decorators = [
        { type: Component, args: [{
                    selector: 'ap-scenario',
                    template: "<ng-template></ng-template>"
                },] },
    ];
    /** @nocollapse */
    ScenarioComponent.ctorParameters = function () { return [
        { type: NgZone },
        { type: undefined, decorators: [{ type: Inject, args: [MIDDLEWARE,] }] }
    ]; };
    ScenarioComponent.propDecorators = {
        selectedSandboxAndScenarioKeys: [{ type: Input }]
    };
    return ScenarioComponent;
}());
export { ScenarioComponent };
//# sourceMappingURL=scenario.component.js.map