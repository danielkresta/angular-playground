import { Component, Inject, QueryList, ViewChildren } from '@angular/core';
import { FormControl } from '@angular/forms';
import { EventManager } from '@angular/platform-browser';
import { StateService } from './shared/state.service';
import { UrlService } from './shared/url.service';
import { fuzzySearch } from './shared/fuzzy-search.function';
import { LevenshteinDistance } from './shared/levenshtein-distance';
import { SandboxLoader } from './shared/sandbox-loader';
import { MIDDLEWARE } from '../lib/middlewares';
import { Observable } from 'rxjs';
import { debounceTime, distinctUntilChanged } from 'rxjs/operators';
var AppComponent = /** @class */ (function () {
    function AppComponent(stateService, urlService, eventManager, levenshteinDistance, middleware) {
        this.stateService = stateService;
        this.urlService = urlService;
        this.eventManager = eventManager;
        this.levenshteinDistance = levenshteinDistance;
        this.middleware = middleware;
        this.commandBarActive = false;
        this.commandBarPreview = false;
        this.selectedSandboxAndScenarioKeys = { sandboxKey: null, scenarioKey: null };
        this.filter = new FormControl();
        this.shortcuts = this.getShortcuts();
    }
    AppComponent.prototype.ngOnInit = function () {
        var _this = this;
        var sandboxMenuItems = SandboxLoader.getSandboxMenuItems();
        this.middleware
            .subscribe(function (middleware) { return _this.activeMiddleware = middleware; });
        if (this.urlService.embed) {
            this.selectedSandboxAndScenarioKeys = {
                sandboxKey: this.urlService.select.sandboxKey,
                scenarioKey: this.urlService.select.scenarioKey
            };
        }
        else {
            if (this.urlService.select) {
                this.selectedSandboxAndScenarioKeys = {
                    sandboxKey: this.urlService.select.sandboxKey,
                    scenarioKey: this.urlService.select.scenarioKey
                };
            }
            this.eventManager.addGlobalEventListener('window', 'keydown.control.p', this.blockEvent);
            this.eventManager.addGlobalEventListener('window', 'keydown.F2', this.blockEvent);
            this.eventManager.addGlobalEventListener('window', 'keyup.control.p', function (event) {
                _this.blockEvent(event);
                _this.toggleCommandBar();
            });
            this.eventManager.addGlobalEventListener('window', 'keyup.F2', function (event) {
                _this.blockEvent(event);
                _this.toggleCommandBar();
            });
            var filterValue = this.stateService.getFilter();
            this.totalSandboxes = sandboxMenuItems.length;
            this.filteredSandboxMenuItems = this.filterSandboxes(sandboxMenuItems, filterValue);
            this.findUniqueLabels(sandboxMenuItems);
            this.expandSelectedScenario(this.selectedSandboxAndScenarioKeys);
            this.filter.setValue(filterValue);
            this.filter.valueChanges.pipe(debounceTime(300), distinctUntilChanged())
                .subscribe(function (value) {
                _this.stateService.setFilter(value);
                _this.filteredSandboxMenuItems = _this.filterSandboxes(sandboxMenuItems, value);
                _this.findUniqueLabels(_this.filteredSandboxMenuItems);
                console.log(_this.menuCategories);
                if (!value) {
                    //this.selectScenario(null, null);
                }
            });
        }
    };
    AppComponent.prototype.onFilterBoxArrowDown = function (event, switchToScenario) {
        if (switchToScenario === void 0) { switchToScenario = false; }
        event.preventDefault();
        var elementRef;
        var currentIndex = this.findCurrentScenarioIndex();
        if (currentIndex) {
            elementRef = this.focusScenarioLinkElement(currentIndex + 1);
        }
        else {
            elementRef = this.focusScenarioLinkElement(0);
        }
        if (switchToScenario) {
            this.showScenario(elementRef);
        }
    };
    AppComponent.prototype.onFilterBoxArrowUp = function (event, switchToScenario) {
        if (switchToScenario === void 0) { switchToScenario = false; }
        event.preventDefault();
        var elementRef;
        var currentIndex = this.findCurrentScenarioIndex();
        if (currentIndex) {
            elementRef = this.focusScenarioLinkElement(currentIndex - 1);
        }
        else if (this.scenarioLinkElements.length > 0) {
            elementRef = this.focusScenarioLinkElement(this.scenarioLinkElements.length - 1);
        }
        if (switchToScenario) {
            this.showScenario(elementRef);
        }
    };
    AppComponent.prototype.onScenarioLinkKeyDown = function (scenarioElement, filterElement, event) {
        event.preventDefault();
        switch (event.key) {
            case 'Up':
            case 'ArrowUp':
                this.goUp(scenarioElement);
                break;
            case 'Down':
            case 'ArrowDown':
                this.goDown(scenarioElement);
                break;
            default:
                if (event.key !== 'Escape' && event.key !== 'Enter') {
                    if (event.key.length === 1) {
                        this.filter.setValue("" + this.filter.value + event.key);
                    }
                    filterElement.focus();
                }
                break;
        }
    };
    AppComponent.prototype.onScenarioLinkKeyUp = function (scenarioElement, event) {
        event.preventDefault();
        switch (event.key) {
            case 'Escape':
                this.commandBarActive = false;
                break;
            case 'Enter':
                scenarioElement.click();
                break;
        }
    };
    AppComponent.prototype.onScenarioLinkControlDown = function (scenarioElement, event) {
        if (!this.commandBarActive)
            return;
        event.preventDefault();
        var elementRef = this.goDown(scenarioElement);
        this.showScenario(elementRef);
    };
    AppComponent.prototype.onScenarioLinkControlUp = function (scenarioElement, event) {
        if (!this.commandBarActive)
            return;
        event.preventDefault();
        var elementRef = this.goUp(scenarioElement);
        this.showScenario(elementRef);
    };
    AppComponent.prototype.onCommandBarStartPreview = function (event) {
        event.preventDefault();
        this.commandBarPreview = true;
    };
    AppComponent.prototype.onCommandBarStopPreview = function () {
        this.commandBarPreview = false;
    };
    AppComponent.prototype.onScenarioClick = function (sandboxKey, scenarioKey, event) {
        event.stopPropagation();
        event.preventDefault();
        this.selectScenario(sandboxKey, scenarioKey);
    };
    AppComponent.prototype.isSelected = function (sandbox, scenario) {
        return this.selectedSandboxAndScenarioKeys.scenarioKey === scenario.key
            && this.selectedSandboxAndScenarioKeys.sandboxKey.toLowerCase() === sandbox.key.toLowerCase();
    };
    AppComponent.prototype.toggleCommandBar = function () {
        this.commandBarActive = !this.commandBarActive;
    };
    AppComponent.prototype.onCategoryClick = function (category, event) {
        event.stopPropagation();
        category.visible = !category.visible;
    };
    AppComponent.prototype.onSandboxHeaderClick = function (sandbox, event) {
        event.stopPropagation();
        sandbox.visible = !sandbox.visible;
    };
    AppComponent.prototype.onLabelClick = function (event) {
        event.stopPropagation();
    };
    AppComponent.prototype.onGroupClick = function (group, event) {
        event.stopPropagation();
        group.visible = !group.visible;
    };
    AppComponent.prototype.blockEvent = function (e) {
        e.preventDefault();
        e.stopPropagation();
    };
    AppComponent.prototype.showScenario = function (selectedScenarioElementRef) {
        if (selectedScenarioElementRef) {
            this.selectScenario(selectedScenarioElementRef.nativeElement.getAttribute('sandboxMenuItemKey'), parseInt(selectedScenarioElementRef.nativeElement.getAttribute('scenarioMenuItemkey'), 10));
        }
    };
    AppComponent.prototype.findCurrentScenarioIndex = function () {
        var currentIndex;
        if (this.scenarioLinkElements.length > 0) {
            this.scenarioLinkElements.map(function (element, i) {
                if (element.nativeElement.className.includes('selected')) {
                    currentIndex = i;
                }
            });
        }
        return currentIndex;
    };
    AppComponent.prototype.goUp = function (scenarioElement) {
        var currentIndex = -1;
        this.scenarioLinkElements.forEach(function (scenarioElementRef, index) {
            if (scenarioElementRef.nativeElement === scenarioElement) {
                currentIndex = index;
            }
        });
        if (currentIndex === 0) {
            return this.focusScenarioLinkElement(this.scenarioLinkElements.length - 1);
        }
        else {
            return this.focusScenarioLinkElement(currentIndex - 1);
        }
    };
    AppComponent.prototype.goDown = function (scenarioElement) {
        var currentIndex = -1;
        this.scenarioLinkElements.forEach(function (scenarioElementRef, index) {
            if (scenarioElementRef.nativeElement === scenarioElement) {
                currentIndex = index;
            }
        });
        if (currentIndex === this.scenarioLinkElements.length - 1) {
            return this.focusScenarioLinkElement(0);
        }
        else {
            return this.focusScenarioLinkElement(currentIndex + 1);
        }
    };
    AppComponent.prototype.focusScenarioLinkElement = function (index) {
        if (this.scenarioLinkElements.toArray()[index]) {
            var elementRef = this.scenarioLinkElements.toArray()[index];
            elementRef.nativeElement.focus();
            return elementRef;
        }
    };
    AppComponent.prototype.findUniqueLabels = function (sandboxMenuItems) {
        var _this = this;
        if (sandboxMenuItems == null) {
            return;
        }
        this.menuCategories = sandboxMenuItems.reduce(function (result, item) {
            var categoryIndex = result.findIndex(function (obj) { return obj.name === item.label; });
            var sandboxIndex;
            if (categoryIndex === -1) {
                categoryIndex = result.length;
                sandboxIndex = 0;
                result.push({
                    name: item.label,
                    visible: true,
                    sandboxes: [{
                            name: item.name,
                            visible: false,
                            docsUrl: _this.getDocsUrl(item.label, item.name),
                            sandboxMenuItem: item,
                            groups: []
                        }]
                });
            }
            else if (categoryIndex > -1) {
                sandboxIndex = result[categoryIndex].sandboxes.length;
                result[categoryIndex].sandboxes.push({
                    name: item.name,
                    visible: false,
                    docsUrl: _this.getDocsUrl(item.label, item.name),
                    sandboxMenuItem: item,
                    groups: []
                });
            }
            _this.assignGroups(result[categoryIndex].sandboxes[sandboxIndex]);
            return result;
        }, []);
        return;
    };
    AppComponent.prototype.getDocsUrl = function (category, component) {
        var docsFixedPrefix = 'http://sparrow.logex.local/framework-documentation/#!/directives/';
        var componentRegex = /Component/gi;
        var pipeRegex = /Pipe/gi;
        var directiveRegex = /Directive/gi;
        component = component
            .replace(componentRegex, '')
            .replace(pipeRegex, '')
            .replace(directiveRegex, '')
            .split(/(?=[A-Z])/)
            .join("-").toLowerCase();
        return docsFixedPrefix + category.toLowerCase() + '/' + component;
    };
    AppComponent.prototype.assignGroups = function (sandbox) {
        var groupsRegex = /\s*([^;]+)(?:[;,]\s*subgroup:([^;]+))?/;
        var group;
        var description;
        sandbox.sandboxMenuItem.scenarioMenuItems.forEach(function (item) {
            var _a;
            // String expected to contain encoded group and description
            _a = groupsRegex.exec(item.description), description = _a[1], group = _a[2];
            // reset regex
            groupsRegex.lastIndex = 0;
            group = group === undefined ? 'default' : group;
            // Find if group already exists in the list
            var groupIndex = sandbox.groups.findIndex(function (obj) { return obj.name === group; });
            if (groupIndex === -1) {
                groupIndex = sandbox.groups.length;
                sandbox.groups.push({
                    name: group,
                    visible: false,
                    scenarios: [{
                            name: description,
                            scenarioMenuItem: item
                        }]
                });
            }
            else if (groupIndex > -1) {
                sandbox.groups[groupIndex].scenarios.push({
                    name: description,
                    scenarioMenuItem: item
                });
            }
        });
        return;
    };
    AppComponent.prototype.filterSandboxes = function (sandboxMenuItems, filter) {
        var _this = this;
        if (!filter) {
            return sandboxMenuItems.map(function (item, i) { return Object.assign({}, item, { tabIndex: i }); });
        }
        var tabIndex = 0;
        var filterNormalized = filter.toLowerCase();
        return sandboxMenuItems
            .reduce(function (accum, curr) {
            var searchKeyNormalized = curr.searchKey.toLowerCase();
            var indexMatches = fuzzySearch(filterNormalized, searchKeyNormalized);
            if (indexMatches) {
                var weight = _this.levenshteinDistance.getDistance(filterNormalized, searchKeyNormalized);
                return accum.concat([Object.assign({}, curr, { weight: weight, indexMatches: indexMatches })]);
            }
            else {
                return accum;
            }
        }, [])
            .sort(function (a, b) {
            return a.weight - b.weight;
        })
            .map(function (sandboxMenuItem) { return Object.assign({}, sandboxMenuItem, { tabIndex: tabIndex++ }); });
    };
    AppComponent.prototype.selectScenario = function (sandboxKey, scenarioKey) {
        this.selectedSandboxAndScenarioKeys = { sandboxKey: sandboxKey, scenarioKey: scenarioKey };
        this.urlService.setSelected(sandboxKey, scenarioKey);
    };
    AppComponent.prototype.getShortcuts = function () {
        return [
            {
                keys: ['ctrl + p', 'f2'],
                description: 'Toggle command bar open/closed'
            },
            {
                keys: ['esc'],
                description: 'Close command bar'
            },
            {
                keys: ['\u2191', '\u2193'],
                description: 'Navigate up or down in command bar list'
            },
            {
                keys: ['ctrl + \u2191', 'ctrl + \u2193'],
                description: 'Switch scenarios while navigating up or down in command bar list'
            }
        ];
    };
    AppComponent.prototype.expandSelectedScenario = function (selected) {
        if (selected.sandboxKey == null && selected.scenarioKey == null) {
            return;
        }
        var index;
        index = this.findItemByKey(selected.sandboxKey, selected.scenarioKey);
        this.menuCategories[index.categoryIndex].visible = true;
        this.menuCategories[index.categoryIndex].sandboxes[index.sandboxIndex].visible = true;
        this.menuCategories[index.categoryIndex].sandboxes[index.sandboxIndex].groups[index.groupIndex].visible = true;
        return;
    };
    AppComponent.prototype.findItemByKey = function (sandboxKey, scenarioKey) {
        var categoryIndex = null;
        var sandboxIndex = null;
        var groupIndex = null;
        var scenarioIndex = null;
        for (categoryIndex = 0; categoryIndex < this.menuCategories.length; categoryIndex++) {
            sandboxIndex = this.menuCategories[categoryIndex].sandboxes.findIndex(function (obj) { return obj.sandboxMenuItem.key === sandboxKey; });
            if (sandboxIndex > -1) {
                break;
            }
        }
        if (scenarioKey != null) {
            var groups = this.menuCategories[categoryIndex].sandboxes[sandboxIndex].groups;
            for (groupIndex = 0; groupIndex < this.menuCategories.length; groupIndex++) {
                scenarioIndex = groups[groupIndex].scenarios.findIndex(function (obj) { return obj.scenarioMenuItem.key === scenarioKey; });
                if (scenarioIndex > -1) {
                    break;
                }
            }
        }
        return {
            categoryIndex: categoryIndex,
            sandboxIndex: sandboxIndex,
            groupIndex: groupIndex,
            scenarioIndex: scenarioIndex
        };
    };
    AppComponent.decorators = [
        { type: Component, args: [{
                    selector: 'ap-root',
                    template: "\n      <!--\n      <div class=\"shield\" *ngIf=\"commandBarActive\" (click)=\"toggleCommandBar()\"></div>\n      -->\n      <div class=\"command-bar command-bar--open\" *ngIf=\"filteredSandboxMenuItems\"\n           (keydown.control)=\"onCommandBarStartPreview($event)\"\n           (keyup.control)=\"onCommandBarStopPreview()\"\n           [class.command-bar--preview]=\"commandBarPreview\">\n          <input\n              class=\"command-bar__filter\"\n              type=\"text\"\n              name=\"filter\"\n              placeholder=\"search...\"\n              [formControl]=\"filter\"\n              #filterElement\n              (keydown.arrowup)=\"onFilterBoxArrowUp($event)\"\n              (keydown.arrowdown)=\"onFilterBoxArrowDown($event)\"\n              (keydown.control.arrowup)=\"onFilterBoxArrowUp($event, true)\"\n              (keydown.control.arrowdown)=\"onFilterBoxArrowDown($event, true)\">\n          <div class=\"command-bar__categories\">\n              <div\n                  class=\"command-bar__category\"\n                  *ngFor=\"let category of menuCategories; index as categoryIndex\">\n                  <div\n                      class=\"command-bar__category__title\"\n                      *ngIf=\"filteredSandboxMenuItems && filteredSandboxMenuItems.length > 0\">\n                      <span (click)=\"onCategoryClick(category, $event)\"\n                          class=\"command-bar__category__name\">\n                          {{category.name}}\n                      </span>\n                  </div>\n                  <div *ngIf=\"filteredSandboxMenuItems && filteredSandboxMenuItems.length > 0\n                              && category.visible\"\n                      class=\"command-bar__sandboxes\">\n                      <ng-container *ngFor=\"let sandbox of category.sandboxes; index as sandboxIndex\">\n                          <div class=\"command-bar__sandbox\"\n                              (click)=\"onSandboxHeaderClick(sandbox, $event)\">\n                              <h2 class=\"command-bar__title\" title=\"{{category.name}} {{sandbox.name}}\"\n                                  [class.command-bar__sandbox-title--selected]=\"selectedSandboxAndScenarioKeys.sandboxKey === sandbox.sandboxMenuItem.key\">\n                                  <span class=\"command-bar__name\"\n                                      [innerHtml]=\"sandbox.name | apHighlightSearchMatch : sandbox.sandboxMenuItem.indexMatches\"></span>\n                                  <a\n                                      class=\"command-bar__label\"\n                                      [href]=\"sandbox.docsUrl\"\n                                      target=\"_blank\"\n                                      (click)=onLabelClick($event)>\n                                      doc\n                                  </a>\n                              </h2>\n                              <ng-container\n                                  *ngIf=\"sandbox.visible\">\n                                  <div \n                                      class=\"command-bar__sandbox__groups\"\n                                      *ngFor=\"let group of sandbox.groups; index as groupIndex\">\n                                      <div\n                                          class=\"command-bar__sandbox__group\"\n                                          (click)=\"onGroupClick(group, $event)\"\n                                          *ngIf=\"sandbox.groups.length > 1\n                                              || ( sandbox.groups.length === 1 && group.name !== 'default' ) \">\n                                          <span\n                                              class=\"command-bar__sandbox__group__title\">\n                                              {{group.name}}\n                                          </span>\n                                      </div>\n                                      <div class=\"command-bar__scenarios\"\n                                          *ngIf=\"group.visible || ( sandbox.groups.length === 1 && group.name === 'default' )\">\n                                          <ng-container\n                                              *ngFor=\"let scenario of group.scenarios; index as scenarioIndex\">\n                                              <a\n                                                  class=\"command-bar__scenario-link\"\n                                                  #scenarioElement\n                                                  [tabindex]=\"scenario.scenarioMenuItem.tabIndex\"\n                                                  [attr.sandboxMenuItemKey]=\"sandbox.sandboxMenuItem.key\"\n                                                  [attr.scenarioMenuItemkey]=\"scenario.scenarioMenuItem.key\"\n                                                  (keydown.control.arrowup)=\"onScenarioLinkControlUp(scenarioElement, $event)\"\n                                                  (keydown.control.arrowdown)=\"onScenarioLinkControlDown(scenarioElement, $event)\"\n                                                  (keydown.arrowup)=\"onScenarioLinkKeyDown(scenarioElement, filterElement, $event)\"\n                                                  (keydown.arrowdown)=\"onScenarioLinkKeyDown(scenarioElement, filterElement, $event)\"\n                                                  (keydown.esc)=\"onScenarioLinkKeyDown(scenarioElement, filterElement, $event)\"\n                                                  (keydown.enter)=\"onScenarioLinkKeyDown(scenarioElement, filterElement, $event)\"\n                                                  (keyup.esc)=\"onScenarioLinkKeyUp(scenarioElement, $event)\"\n                                                  (keyup.enter)=\"onScenarioLinkKeyUp(scenarioElement, $event)\"\n                                                  (click)=\"onScenarioClick(sandbox.sandboxMenuItem.key, scenario.scenarioMenuItem.key, $event); toggleCommandBar()\"\n                                                  [class.command-bar__scenario-link--selected]=\"isSelected(sandbox.sandboxMenuItem, scenario.scenarioMenuItem)\">\n                                                  <ap-pin [selected]=\"isSelected(sandbox.sandboxMenuItem, scenario.scenarioMenuItem)\"></ap-pin>\n                                                  <span class=\"command-bar__scenario-label\">\n                                                      {{scenario.name}}\n                                                  </span>\n                                              </a>\n                                          </ng-container>\n                                      </div>\n                                  </div>\n                              </ng-container>\n                          </div>\n                      </ng-container>\n                  </div>\n              </div>\n          </div>\n          <a *ngIf=\"filteredSandboxMenuItems && filteredSandboxMenuItems.length > 0\" class=\"command-bar__brand\"\n             href=\"http://www.angularplayground.it/\" target=\"_blank\">\n              <ap-logo></ap-logo>\n          </a>\n      </div>\n      <section class=\"content\">\n          <ap-drawer *ngIf=\"activeMiddleware.overlay\" (openCommandBarClick)=\"toggleCommandBar()\" [class.content__menu--hide]=\"commandBarActive\" class=\"content__menu\"></ap-drawer>\n          <div class=\"content__none\" *ngIf=\"!selectedSandboxAndScenarioKeys.sandboxKey\">\n              <div class=\"content__none-message\">\n                  <p *ngIf=\"totalSandboxes > 0\">\n                      The playground has {{totalSandboxes}} sandboxed component{{totalSandboxes > 1 ? 's' : ''}}\n                  </p>\n                  <p *ngIf=\"totalSandboxes === 0\">\n                      Get started - create your first sandbox! <a href=\"http://www.angularplayground.it/docs/how-to/sandboxing-components\" target=\"_blank\">Click here</a>.\n                  </p>\n                  <!--\n                  <div class=\"content__shortcuts\">\n                      <div class=\"content__shortcut\" *ngFor=\"let shortcut of shortcuts\">\n                          <div class=\"content__shortcut-label\">\n                              <ng-container *ngFor=\"let key of shortcut.keys; let i = index\">\n                                  <code>\n                                      {{key}}\n                                  </code>\n                                  <ng-container *ngIf=\"shortcut.keys.length > 1 && i < shortcut.keys.length - 1\">&nbsp;&nbsp;/&nbsp;&nbsp;</ng-container>\n                              </ng-container>\n                          </div>\n                          <div class=\"content__shortcut-value\">\n                              {{shortcut.description}}\n                          </div>\n                      </div>\n                  </div>\n              -->\n              </div>\n          </div>\n          <ng-container *ngIf=\"selectedSandboxAndScenarioKeys.sandboxKey\">\n              <ap-scenario [selectedSandboxAndScenarioKeys]=\"selectedSandboxAndScenarioKeys\"></ap-scenario>\n          </ng-container>\n      </section>\n    ",
                    styles: ["\n          /* Globals */\n          * {\n            box-sizing: border-box;\n          }\n\n          :host {\n            display: flex;\n            flex-direction: row;\n            justify-content: flex-start;\n          }\n\n          /* Shield */\n          .shield {\n            height: 100vh;\n            opacity: 0;\n            position: absolute;\n            z-index: 2;\n            width: 100%;\n          }\n\n          /* Command Bar */\n          .command-bar {\n            background-color: #252526;\n            box-shadow: 0 3px 8px 5px black;\n            color: white;\n            display: flex;\n            flex-direction: column;\n            font-family: Consolas, monospace;\n            left: 188px;\n            margin-right: 10px;\n            margin-top: -6px;\n            padding-top: 10px;\n            position: relative;\n            transform: translate(-50%, -120%);\n            transition: transform ease 100ms, opacity ease 100ms;\n            width: 376px;\n            /*\n            z-index: 9999999999999;\n            */\n          }\n\n          .command-bar::before {\n            border-bottom: solid 1px black;\n            content: \"\";\n            display: block;\n            position: relative;\n            top: 52px;\n            width: 100%;\n          }\n\n          .command-bar--open {\n            min-height: 60px;\n            transform: translate(-50%, 0);\n          }\n\n          .command-bar--preview {\n            opacity: .7;\n          }\n\n          .command-bar__filter {\n            background-color: #3c3c3c;\n            border: 1px solid #174a6c;\n            color: white;\n            font-family: Consolas, monospace;\n            font-size: 16px;\n            margin: 6px 0 10px 5px;\n            padding: 8px;\n            width: 365px;\n            z-index: 1;\n          }\n\n          .command-bar__filter::placeholder {\n            color: #a9a9a9;\n          }\n\n          .command-bar__filter:-ms-input-placeholder {\n            color: #a9a9a9;\n          }\n\n          .command-bar__filter::-moz-focus-inner {\n            border: 0;\n            padding: 0;\n          }\n\n          /* Categories */\n          .command-bar__categories {\n              overflow: auto;\n              max-height: calc(100vh - 109px);\n          }\n\n          .command-bar__categories::-webkit-scrollbar {\n              background-color: transparent;\n              width: 6px;\n          }\n  \n            .command-bar__categories::-webkit-scrollbar-track {\n              border-left: solid 1px black;\n              background: rgba(255, 255, 255, 0.1);\n          }\n  \n            .command-bar__categories::-webkit-scrollbar-thumb  {\n              background-color: rgba(255, 255, 255, 0.1);\n              margin-left: 2px;\n              width: 4px;\n          }\n\n          .command-bar__category {\n              margin-top: 9px;\n          }\n\n          .command-bar__category__title {\n              padding: 5px;\n          }\n\n          .command-bar__category__name {\n              color: rgba(255, 255, 255, .8);\n              font-family: Consolas, monospace;\n              font-size: 16px;\n              margin: 0;\n          }\n\n          .command-bar__category__name:hover,\n          .command-bar__category__name:active,\n          .command-bar__category__name:focus {\n            opacity: 0.8;\n            outline-style: none;\n            cursor: pointer;\n          }\n\n          /* Sandboxes */\n          .command-bar__sandboxes {\n            border-top: solid 1px rgba(255, 255, 255, .1);\n            /*overflow: auto;*/\n            position: relative;\n          }\n\n          .command-bar__sandbox {\n            border-bottom: solid 1px black;\n            border-top: solid 1px rgba(255, 255, 255, .1);\n            padding: 8px 6px 4px;\n          }\n    \n          .command-bar__sandbox:hover,\n          .command-bar__sandbox:active,\n          .command-bar__sandbox:focus {\n            background-color: #202020;\n            color: white;\n            outline-style: none;\n            cursor: default;\n          }\n\n          .command-bar__sandbox:first-child {\n            border-top: none;\n          }\n\n          .command-bar__sandbox:last-child {\n            border-bottom: none;\n            padding-bottom: 3px;\n          }\n\n          .command-bar__title {\n            /*align-items: center;*/\n            color: rgba(255, 255, 255, .6);\n            display: flex;\n            font-family: Consolas, monospace;\n            font-size: 12px;\n            font-weight: normal;\n            justify-content: space-between;\n            margin: 0;\n            padding: 5px 0 0;\n          }\n\n          .command-bar__title ::ng-deep mark {\n            background: transparent;\n            color: #0097fb;\n            font-weight: bold;\n          }\n\n          .command-bar__name {\n            max-width: 100%;\n            overflow: hidden;\n            text-overflow: ellipsis;\n            white-space: nowrap;\n          }\n\n          .command-bar__label {\n            background: rgba(255, 255, 255, .1);\n            border-radius: 2px;\n            display: block;\n            font-size: 10px;\n            margin-left: 10px;\n            padding: 4px 5px 3px;\n            text-decoration: none;\n            color: #3195bf;\n            border: solid 1px #252526;\n          }\n\n          .command-bar__label:hover,\n          .command-bar__label:active,\n          .command-bar__label:focus {\n            opacity: 0.9;\n            outline-style: none;\n            border: solid 1px #666666;\n          }\n\n          /* Scenario Groups */\n\n          .command-bar__sandbox__group {\n              padding: 3px 10px 3px 3px;\n              display: inline-block;\n          }\n\n          .command-bar__sandbox__group__title {\n              color: rgba(255, 255, 255, .4);\n              font-family: Consolas, monospace;\n              font-size: 12px;\n              margin: 0;\n          }\n\n          .command-bar__sandbox__group__title:hover,\n          .command-bar__sandbox__group__title:active,\n          .command-bar__sandbox__group__title:focus {\n              opacity: 0.8;\n              outline-style: none;\n              cursor: pointer;\n          }\n\n          .command-bar__sandbox__groups{\n              margin: 3px;\n          }\n\n          /* Scenarios */\n          .command-bar__scenarios {\n            /*\n            display: flex;\n            */\n          }\n\n          .command-bar__scenario-link {\n            align-items: center;\n            border-radius: 2px;\n            color: rgba(255, 255, 255, .5);\n            cursor: pointer;\n            display: flex;\n            padding: 4px 3px;\n            width: 100%;\n          }\n\n          .command-bar__scenario-link:hover,\n          .command-bar__scenario-link:active,\n          .command-bar__scenario-link:focus {\n            background-color: #0097fb;\n            color: white;\n            outline-style: none;\n          }\n\n          .command-bar__scenario-link:hover .command-bar__scenario-icon,\n          .command-bar__scenario-link:active .command-bar__scenario-icon,\n          .command-bar__scenario-link:focus .command-bar__scenario-icon {\n            opacity: .5;\n          }\n\n          .command-bar__scenario-label {\n            line-height: 1;\n            max-width: calc(100% - 26px);\n            min-width: calc(100% - 26px);\n            padding-bottom: 2px;\n          }\n\n          .command-bar__scenario-link--selected {\n            background: rgba(255, 255, 255, .1);\n            color: white;\n          }\n\n          .command-bar__scenario-link:hover .command-bar__scenario-icon--selected,\n          .command-bar__scenario-link:active .command-bar__scenario-icon--selected,\n          .command-bar__scenario-link:focus .command-bar__scenario-icon--selected {\n            fill: white;\n          }\n\n          /* Brand */\n          .command-bar__brand {\n            border-top: solid 1px black;\n            display: block;\n            position: relative;\n            padding: 9px 0 3px;\n            text-align: center;\n          }\n\n          .command-bar__brand::before {\n            border-bottom: solid 1px rgba(255, 255, 255, .1);\n            content: \"\";\n            display: block;\n            left: 0;\n            position: absolute;\n            top: 0;\n            width: 100%;\n          }\n\n          .command-bar__brand:hover .command-bar__logo__box {\n            fill: rgba(255, 255, 255, .2);\n          }\n\n          .command-bar__brand:hover .command-bar__logo__letter {\n            fill: rgba(255, 255, 255, .75);\n          }\n\n          /* Content */\n          .content {\n              display: flex;\n              height: 100vh;\n          }\n\n\n          .content__none {\n            /*\n            align-items: center;\n            */\n            border: 0;\n            display: flex;\n            min-height: calc(100vh - 4em);\n            justify-content: center;\n            padding-top: 2em;\n            padding-bottom: 2em;\n            position: relative;\n            width: 100%;\n          }\n\n          .content__none-message {\n            font-family: Arial, sans-serif;\n            max-width: 50%;\n            min-width: 450px;\n            text-align: center;\n          }\n\n          .content__none-message em {\n            color: #666;\n          }\n\n          .content__none-message p {\n            font-size: 20px;\n          }\n\n          .content__shortcuts {\n            border-top: solid 1px #ccc;\n            margin-top: 2em;\n            padding: 30px 0 0 100px;\n            width: 520px;\n          }\n\n          .content__shortcut {\n            display: flex;\n          }\n\n          .content__shortcut-label {\n            align-items: center;\n            display: flex;\n            font-size: 11px;\n            justify-content: flex-end;\n            max-width: 150px;\n            min-width: 150px;\n            padding: 8px 12px 8px 0;\n            white-space: nowrap;\n          }\n\n          .content__shortcut-label code {\n            background: #eee;\n            border: solid 1px #ccc;\n            border-radius: 4px;\n            padding: 3px 7px;\n          }\n\n          .content__shortcut-value {\n            align-items: center;\n            display: flex;\n            font-size: 11px;\n            line-height: 1.75;\n            text-align: left;\n            white-space: nowrap;\n          }\n    "]
                },] },
    ];
    /** @nocollapse */
    AppComponent.ctorParameters = function () { return [
        { type: StateService },
        { type: UrlService },
        { type: EventManager },
        { type: LevenshteinDistance },
        { type: Observable, decorators: [{ type: Inject, args: [MIDDLEWARE,] }] }
    ]; };
    AppComponent.propDecorators = {
        scenarioLinkElements: [{ type: ViewChildren, args: ['scenarioElement',] }]
    };
    return AppComponent;
}());
export { AppComponent };
//# sourceMappingURL=app.component.js.map