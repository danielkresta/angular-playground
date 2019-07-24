var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
import { Injectable } from '@angular/core';
import { Location } from '@angular/common';
import { SandboxLoader } from './sandbox-loader';
let UrlService = class UrlService {
    constructor(location) {
        this.location = location;
        this._embed = null;
        this._select = null;
        this.sandboxMenuItems = SandboxLoader.getSandboxMenuItems();
        let urlPath = location.path();
        this._embed = /[?|&]embed=1/.exec(urlPath) !== null;
        this._select = this.parse('scenario', this.sandboxMenuItems, urlPath);
        if (this._select) {
            if (this._select.sandboxKey === null && this._select.scenarioKey === null) {
                this.location.replaceState('');
                return;
            }
        }
    }
    get embed() {
        return this._embed;
    }
    get select() {
        return this._select;
    }
    setSelected(sandboxKey, scenarioKey) {
        if (sandboxKey === null && scenarioKey === null) {
            this.location.replaceState('');
            return;
        }
        let scenarioDescription = this.sandboxMenuItems
            .find(sandboxMenuItem => sandboxMenuItem.key.toLowerCase() === sandboxKey.toLowerCase())
            .scenarioMenuItems.find(scenarioMenuItem => scenarioMenuItem.key === scenarioKey).description;
        this.location.replaceState(`?scenario=${encodeURIComponent(sandboxKey)}/${encodeURIComponent(scenarioDescription)}`);
    }
    parse(key, sandboxMenuItems, urlPath) {
        let match = new RegExp('[?|&]' + key + '=([^&#]*)').exec(urlPath);
        if (match !== null) {
            let value = match[1];
            let firstSlash = value.indexOf('/');
            let sbKey = value.substr(0, firstSlash);
            let sandboxKey = decodeURIComponent(sbKey);
            let sandboxMenuItem = sandboxMenuItems
                .find(smi => smi.key.toLowerCase() === sandboxKey.toLowerCase());
            if (!sandboxMenuItem) {
                return { sandboxKey: null, scenarioKey: null };
            }
            let scenarioDesc = decodeURIComponent(value.substr(firstSlash + 1, value.length).toLowerCase());
            let scenarioKey = sandboxMenuItem.scenarioMenuItems
                .findIndex(scenarioMenuItem => scenarioMenuItem.description.toLowerCase() === scenarioDesc) + 1;
            if (scenarioKey <= 0) {
                return { sandboxKey: null, scenarioKey: null };
            }
            return { sandboxKey, scenarioKey };
        }
    }
};
UrlService = __decorate([
    Injectable(),
    __metadata("design:paramtypes", [Location])
], UrlService);
export { UrlService };
//# sourceMappingURL=url.service.js.map