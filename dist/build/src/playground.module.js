var __assign = (this && this.__assign) || Object.assign || function(t) {
    for (var s, i = 1, n = arguments.length; i < n; i++) {
        s = arguments[i];
        for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
            t[p] = s[p];
    }
    return t;
};
import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { AppComponent } from './app.component';
import { PlaygroundCommonModule } from './playground-common.module';
import { MIDDLEWARE } from '../lib/middlewares';
import { initializePlayground } from '../lib/initialize-playground';
import { BehaviorSubject } from 'rxjs';
var _middleware = new BehaviorSubject({
    selector: null,
    overlay: false,
    modules: []
});
var middleware = _middleware.asObservable();
var ɵ0 = middleware;
var PlaygroundModule = /** @class */ (function () {
    function PlaygroundModule() {
    }
    PlaygroundModule.configure = function (configuration) {
        initializePlayground(configuration.selector);
        _middleware.next(__assign({}, _middleware.value, configuration));
        return this;
    };
    PlaygroundModule.decorators = [
        { type: NgModule, args: [{
                    imports: [
                        BrowserModule,
                        PlaygroundCommonModule
                    ],
                    providers: [
                        { provide: MIDDLEWARE, useValue: ɵ0 }
                    ],
                    bootstrap: [AppComponent]
                },] },
    ];
    return PlaygroundModule;
}());
export { PlaygroundModule };
export { ɵ0 };
//# sourceMappingURL=playground.module.js.map