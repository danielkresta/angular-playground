import { Injectable } from '@angular/core';
import { Location } from '@angular/common';
import { SandboxLoader } from './sandbox-loader';
var UrlService = /** @class */ (function () {
    function UrlService(location) {
        this.location = location;
        this._embed = null;
        this._select = null;
        this.sandboxMenuItems = SandboxLoader.getSandboxMenuItems();
        var urlPath = location.path();
        this._embed = /[?|&]embed=1/.exec(urlPath) !== null;
        this._select = this.parse('scenario', this.sandboxMenuItems, urlPath);
        if (this._select) {
            if (this._select.sandboxKey === null && this._select.scenarioKey === null) {
                this.location.replaceState('');
                return;
            }
        }
    }
    Object.defineProperty(UrlService.prototype, "embed", {
        get: function () {
            return this._embed;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(UrlService.prototype, "select", {
        get: function () {
            return this._select;
        },
        enumerable: true,
        configurable: true
    });
    UrlService.prototype.setSelected = function (sandboxKey, scenarioKey) {
        if (sandboxKey === null && scenarioKey === null) {
            this.location.replaceState('');
            return;
        }
        var scenarioDescription = this.sandboxMenuItems
            .find(function (sandboxMenuItem) { return sandboxMenuItem.key.toLowerCase() === sandboxKey.toLowerCase(); })
            .scenarioMenuItems.find(function (scenarioMenuItem) { return scenarioMenuItem.key === scenarioKey; }).description;
        this.location.replaceState("?scenario=" + encodeURIComponent(sandboxKey) + "/" + encodeURIComponent(scenarioDescription));
    };
    UrlService.prototype.parse = function (key, sandboxMenuItems, urlPath) {
        var match = new RegExp('[?|&]' + key + '=([^&#]*)').exec(urlPath);
        if (match !== null) {
            var value = match[1];
            var firstSlash = value.indexOf('/');
            var sbKey = value.substr(0, firstSlash);
            var sandboxKey_1 = decodeURIComponent(sbKey);
            var sandboxMenuItem = sandboxMenuItems
                .find(function (smi) { return smi.key.toLowerCase() === sandboxKey_1.toLowerCase(); });
            if (!sandboxMenuItem) {
                return { sandboxKey: null, scenarioKey: null };
            }
            var scenarioDesc_1 = decodeURIComponent(value.substr(firstSlash + 1, value.length).toLowerCase());
            var scenarioKey = sandboxMenuItem.scenarioMenuItems
                .findIndex(function (scenarioMenuItem) { return scenarioMenuItem.description.toLowerCase() === scenarioDesc_1; }) + 1;
            if (scenarioKey <= 0) {
                return { sandboxKey: null, scenarioKey: null };
            }
            return { sandboxKey: sandboxKey_1, scenarioKey: scenarioKey };
        }
    };
    UrlService.decorators = [
        { type: Injectable },
    ];
    /** @nocollapse */
    UrlService.ctorParameters = function () { return [
        { type: Location }
    ]; };
    return UrlService;
}());
export { UrlService };
//# sourceMappingURL=url.service.js.map