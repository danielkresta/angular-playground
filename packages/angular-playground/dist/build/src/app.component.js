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
let AppComponent = class AppComponent {
    constructor(stateService, urlService, eventManager, levenshteinDistance, middleware) {
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
    ngOnInit() {
        const sandboxMenuItems = SandboxLoader.getSandboxMenuItems();
        this.middleware
            .subscribe(middleware => this.activeMiddleware = middleware);
        if (this.urlService.embed) {
            this.selectedSandboxAndScenarioKeys = {
                sandboxKey: this.urlService.select.sandboxKey,
                scenarioKey: this.urlService.select.scenarioKey,
            };
        }
        else {
            if (this.urlService.select) {
                this.selectedSandboxAndScenarioKeys = {
                    sandboxKey: this.urlService.select.sandboxKey,
                    scenarioKey: this.urlService.select.scenarioKey,
                };
            }
            this.eventManager.addGlobalEventListener('window', 'keydown.control.p', this.blockEvent);
            this.eventManager.addGlobalEventListener('window', 'keydown.F2', this.blockEvent);
            this.eventManager.addGlobalEventListener('window', 'keyup.control.p', (event) => {
                this.blockEvent(event);
                this.toggleCommandBar();
            });
            this.eventManager.addGlobalEventListener('window', 'keyup.F2', (event) => {
                this.blockEvent(event);
                this.toggleCommandBar();
            });
            let filterValue = this.stateService.getFilter();
            this.totalSandboxes = sandboxMenuItems.length;
            this.filteredSandboxMenuItems = this.filterSandboxes(sandboxMenuItems, filterValue);
            this.findUniqueLabels(sandboxMenuItems);
            this.expandSelectedScenario(this.selectedSandboxAndScenarioKeys);
            this.filter.setValue(filterValue);
            this.filter.valueChanges.pipe(debounceTime(300), distinctUntilChanged())
                .subscribe(value => {
                this.stateService.setFilter(value);
                this.filteredSandboxMenuItems = this.filterSandboxes(sandboxMenuItems, value);
                this.findUniqueLabels(this.filteredSandboxMenuItems);
                console.log(this.menuCategories);
                if (!value) {
                    //this.selectScenario(null, null);
                }
            });
        }
    }
    onFilterBoxArrowDown(event, switchToScenario = false) {
        event.preventDefault();
        let elementRef;
        const currentIndex = this.findCurrentScenarioIndex();
        if (currentIndex) {
            elementRef = this.focusScenarioLinkElement(currentIndex + 1);
        }
        else {
            elementRef = this.focusScenarioLinkElement(0);
        }
        if (switchToScenario) {
            this.showScenario(elementRef);
        }
    }
    onFilterBoxArrowUp(event, switchToScenario = false) {
        event.preventDefault();
        let elementRef;
        const currentIndex = this.findCurrentScenarioIndex();
        if (currentIndex) {
            elementRef = this.focusScenarioLinkElement(currentIndex - 1);
        }
        else if (this.scenarioLinkElements.length > 0) {
            elementRef = this.focusScenarioLinkElement(this.scenarioLinkElements.length - 1);
        }
        if (switchToScenario) {
            this.showScenario(elementRef);
        }
    }
    onScenarioLinkKeyDown(scenarioElement, filterElement, event) {
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
                        this.filter.setValue(`${this.filter.value}${event.key}`);
                    }
                    filterElement.focus();
                }
                break;
        }
    }
    onScenarioLinkKeyUp(scenarioElement, event) {
        event.preventDefault();
        switch (event.key) {
            case 'Escape':
                this.commandBarActive = false;
                break;
            case 'Enter':
                scenarioElement.click();
                break;
        }
    }
    onScenarioLinkControlDown(scenarioElement, event) {
        if (!this.commandBarActive)
            return;
        event.preventDefault();
        let elementRef = this.goDown(scenarioElement);
        this.showScenario(elementRef);
    }
    onScenarioLinkControlUp(scenarioElement, event) {
        if (!this.commandBarActive)
            return;
        event.preventDefault();
        let elementRef = this.goUp(scenarioElement);
        this.showScenario(elementRef);
    }
    onCommandBarStartPreview(event) {
        event.preventDefault();
        this.commandBarPreview = true;
    }
    onCommandBarStopPreview() {
        this.commandBarPreview = false;
    }
    onScenarioClick(sandboxKey, scenarioKey, event) {
        event.stopPropagation();
        event.preventDefault();
        this.selectScenario(sandboxKey, scenarioKey);
    }
    isSelected(sandbox, scenario) {
        return this.selectedSandboxAndScenarioKeys.scenarioKey === scenario.key
            && this.selectedSandboxAndScenarioKeys.sandboxKey.toLowerCase() === sandbox.key.toLowerCase();
    }
    toggleCommandBar() {
        this.commandBarActive = !this.commandBarActive;
    }
    onCategoryClick(category, event) {
        event.stopPropagation();
        category.visible = !category.visible;
    }
    onSandboxHeaderClick(sandbox, event) {
        event.stopPropagation();
        sandbox.visible = !sandbox.visible;
    }
    onLabelClick(event) {
        event.stopPropagation();
    }
    onGroupClick(group, event) {
        event.stopPropagation();
        group.visible = !group.visible;
    }
    blockEvent(e) {
        e.preventDefault();
        e.stopPropagation();
    }
    showScenario(selectedScenarioElementRef) {
        if (selectedScenarioElementRef) {
            this.selectScenario(selectedScenarioElementRef.nativeElement.getAttribute('sandboxMenuItemKey'), parseInt(selectedScenarioElementRef.nativeElement.getAttribute('scenarioMenuItemkey'), 10));
        }
    }
    findCurrentScenarioIndex() {
        let currentIndex;
        if (this.scenarioLinkElements.length > 0) {
            this.scenarioLinkElements.map((element, i) => {
                if (element.nativeElement.className.includes('selected')) {
                    currentIndex = i;
                }
            });
        }
        return currentIndex;
    }
    goUp(scenarioElement) {
        let currentIndex = -1;
        this.scenarioLinkElements.forEach((scenarioElementRef, index) => {
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
    }
    goDown(scenarioElement) {
        let currentIndex = -1;
        this.scenarioLinkElements.forEach((scenarioElementRef, index) => {
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
    }
    focusScenarioLinkElement(index) {
        if (this.scenarioLinkElements.toArray()[index]) {
            let elementRef = this.scenarioLinkElements.toArray()[index];
            elementRef.nativeElement.focus();
            return elementRef;
        }
    }
    findUniqueLabels(sandboxMenuItems) {
        if (sandboxMenuItems == null) {
            return;
        }
        this.menuCategories = sandboxMenuItems.reduce((result, item) => {
            let categoryIndex = result.findIndex(obj => obj.name === item.label);
            let sandboxIndex;
            if (categoryIndex === -1) {
                categoryIndex = result.length;
                sandboxIndex = 0;
                result.push({
                    name: item.label,
                    visible: true,
                    sandboxes: [{
                            name: item.name,
                            visible: false,
                            docsUrl: this.getDocsUrl(item.label, item.name),
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
                    docsUrl: this.getDocsUrl(item.label, item.name),
                    sandboxMenuItem: item,
                    groups: []
                });
            }
            this.assignGroups(result[categoryIndex].sandboxes[sandboxIndex]);
            return result;
        }, []);
        return;
    }
    getDocsUrl(category, component) {
        const docsFixedPrefix = 'http://sparrow.logex.local/framework-documentation/#!/directives/';
        const componentRegex = /Component/gi;
        const pipeRegex = /Pipe/gi;
        const directiveRegex = /Directive/gi;
        component = component
            .replace(componentRegex, '')
            .replace(pipeRegex, '')
            .replace(directiveRegex, '')
            .split(/(?=[A-Z])/)
            .join("-").toLowerCase();
        return docsFixedPrefix + category.toLowerCase() + '/' + component;
    }
    assignGroups(sandbox) {
        const groupsRegex = /\s*([^;]+)(?:[;,]\s*subgroup:([^;]+))?/;
        let group;
        let description;
        sandbox.sandboxMenuItem.scenarioMenuItems.forEach(item => {
            // String expected to contain encoded group and description
            [, description, group] = groupsRegex.exec(item.description);
            // reset regex
            groupsRegex.lastIndex = 0;
            group = group === undefined ? 'default' : group;
            // Find if group already exists in the list
            let groupIndex = sandbox.groups.findIndex(obj => obj.name === group);
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
    }
    filterSandboxes(sandboxMenuItems, filter) {
        if (!filter) {
            return sandboxMenuItems.map((item, i) => Object.assign({}, item, { tabIndex: i }));
        }
        let tabIndex = 0;
        let filterNormalized = filter.toLowerCase();
        return sandboxMenuItems
            .reduce((accum, curr) => {
            let searchKeyNormalized = curr.searchKey.toLowerCase();
            let indexMatches = fuzzySearch(filterNormalized, searchKeyNormalized);
            if (indexMatches) {
                let weight = this.levenshteinDistance.getDistance(filterNormalized, searchKeyNormalized);
                return [...accum, Object.assign({}, curr, { weight, indexMatches })];
            }
            else {
                return accum;
            }
        }, [])
            .sort((a, b) => {
            return a.weight - b.weight;
        })
            .map(sandboxMenuItem => Object.assign({}, sandboxMenuItem, { tabIndex: tabIndex++ }));
    }
    selectScenario(sandboxKey, scenarioKey) {
        this.selectedSandboxAndScenarioKeys = { sandboxKey, scenarioKey };
        this.urlService.setSelected(sandboxKey, scenarioKey);
    }
    getShortcuts() {
        return [
            {
                keys: ['ctrl + p', 'f2'],
                description: 'Toggle command bar open/closed',
            },
            {
                keys: ['esc'],
                description: 'Close command bar',
            },
            {
                keys: ['\u2191', '\u2193'],
                description: 'Navigate up or down in command bar list',
            },
            {
                keys: ['ctrl + \u2191', 'ctrl + \u2193'],
                description: 'Switch scenarios while navigating up or down in command bar list',
            },
        ];
    }
    expandSelectedScenario(selected) {
        if (selected.sandboxKey == null && selected.scenarioKey == null) {
            return;
        }
        let index;
        index = this.findItemByKey(selected.sandboxKey, selected.scenarioKey);
        this.menuCategories[index.categoryIndex].visible = true;
        this.menuCategories[index.categoryIndex].sandboxes[index.sandboxIndex].visible = true;
        this.menuCategories[index.categoryIndex].sandboxes[index.sandboxIndex].groups[index.groupIndex].visible = true;
        return;
    }
    findItemByKey(sandboxKey, scenarioKey) {
        let categoryIndex = null;
        let sandboxIndex = null;
        let groupIndex = null;
        let scenarioIndex = null;
        for (categoryIndex = 0; categoryIndex < this.menuCategories.length; categoryIndex++) {
            sandboxIndex = this.menuCategories[categoryIndex].sandboxes.findIndex(obj => obj.sandboxMenuItem.key === sandboxKey);
            if (sandboxIndex > -1) {
                break;
            }
        }
        if (scenarioKey != null) {
            const groups = this.menuCategories[categoryIndex].sandboxes[sandboxIndex].groups;
            for (groupIndex = 0; groupIndex < this.menuCategories.length; groupIndex++) {
                scenarioIndex = groups[groupIndex].scenarios.findIndex(obj => obj.scenarioMenuItem.key === scenarioKey);
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
    }
};
__decorate([
    ViewChildren('scenarioElement'),
    __metadata("design:type", QueryList)
], AppComponent.prototype, "scenarioLinkElements", void 0);
AppComponent = __decorate([
    Component({
        selector: 'ap-root',
        template: `
      <!--
      <div class="shield" *ngIf="commandBarActive" (click)="toggleCommandBar()"></div>
      -->
      <div class="command-bar command-bar--open" *ngIf="filteredSandboxMenuItems"
           (keydown.control)="onCommandBarStartPreview($event)"
           (keyup.control)="onCommandBarStopPreview()"
           [class.command-bar--preview]="commandBarPreview">
          <input
              class="command-bar__filter"
              type="text"
              name="filter"
              placeholder="search..."
              [formControl]="filter"
              #filterElement
              (keydown.arrowup)="onFilterBoxArrowUp($event)"
              (keydown.arrowdown)="onFilterBoxArrowDown($event)"
              (keydown.control.arrowup)="onFilterBoxArrowUp($event, true)"
              (keydown.control.arrowdown)="onFilterBoxArrowDown($event, true)">
          <div class="command-bar__categories">
              <div
                  class="command-bar__category"
                  *ngFor="let category of menuCategories; index as categoryIndex">
                  <div
                      class="command-bar__category__title"
                      *ngIf="filteredSandboxMenuItems && filteredSandboxMenuItems.length > 0">
                      <span (click)="onCategoryClick(category, $event)"
                          class="command-bar__category__name">
                          {{category.name}}
                      </span>
                  </div>
                  <div *ngIf="filteredSandboxMenuItems && filteredSandboxMenuItems.length > 0
                              && category.visible"
                      class="command-bar__sandboxes">
                      <ng-container *ngFor="let sandbox of category.sandboxes; index as sandboxIndex">
                          <div class="command-bar__sandbox"
                              (click)="onSandboxHeaderClick(sandbox, $event)">
                              <h2 class="command-bar__title" title="{{category.name}} {{sandbox.name}}"
                                  [class.command-bar__sandbox-title--selected]="selectedSandboxAndScenarioKeys.sandboxKey === sandbox.sandboxMenuItem.key">
                                  <span class="command-bar__name"
                                      [innerHtml]="sandbox.name | apHighlightSearchMatch : sandbox.sandboxMenuItem.indexMatches"></span>
                                  <a
                                      class="command-bar__label"
                                      [href]="sandbox.docsUrl"
                                      target="_blank"
                                      (click)=onLabelClick($event)>
                                      doc
                                  </a>
                              </h2>
                              <ng-container
                                  *ngIf="sandbox.visible">
                                  <div 
                                      class="command-bar__sandbox__groups"
                                      *ngFor="let group of sandbox.groups; index as groupIndex">
                                      <div
                                          class="command-bar__sandbox__group"
                                          (click)="onGroupClick(group, $event)"
                                          *ngIf="sandbox.groups.length > 1
                                              || ( sandbox.groups.length === 1 && group.name !== 'default' ) ">
                                          <span
                                              class="command-bar__sandbox__group__title">
                                              {{group.name}}
                                          </span>
                                      </div>
                                      <div class="command-bar__scenarios"
                                          *ngIf="group.visible || ( sandbox.groups.length === 1 && group.name === 'default' )">
                                          <ng-container
                                              *ngFor="let scenario of group.scenarios; index as scenarioIndex">
                                              <a
                                                  class="command-bar__scenario-link"
                                                  #scenarioElement
                                                  [tabindex]="scenario.scenarioMenuItem.tabIndex"
                                                  [attr.sandboxMenuItemKey]="sandbox.sandboxMenuItem.key"
                                                  [attr.scenarioMenuItemkey]="scenario.scenarioMenuItem.key"
                                                  (keydown.control.arrowup)="onScenarioLinkControlUp(scenarioElement, $event)"
                                                  (keydown.control.arrowdown)="onScenarioLinkControlDown(scenarioElement, $event)"
                                                  (keydown.arrowup)="onScenarioLinkKeyDown(scenarioElement, filterElement, $event)"
                                                  (keydown.arrowdown)="onScenarioLinkKeyDown(scenarioElement, filterElement, $event)"
                                                  (keydown.esc)="onScenarioLinkKeyDown(scenarioElement, filterElement, $event)"
                                                  (keydown.enter)="onScenarioLinkKeyDown(scenarioElement, filterElement, $event)"
                                                  (keyup.esc)="onScenarioLinkKeyUp(scenarioElement, $event)"
                                                  (keyup.enter)="onScenarioLinkKeyUp(scenarioElement, $event)"
                                                  (click)="onScenarioClick(sandbox.sandboxMenuItem.key, scenario.scenarioMenuItem.key, $event); toggleCommandBar()"
                                                  [class.command-bar__scenario-link--selected]="isSelected(sandbox.sandboxMenuItem, scenario.scenarioMenuItem)">
                                                  <ap-pin [selected]="isSelected(sandbox.sandboxMenuItem, scenario.scenarioMenuItem)"></ap-pin>
                                                  <span class="command-bar__scenario-label">
                                                      {{scenario.name}}
                                                  </span>
                                              </a>
                                          </ng-container>
                                      </div>
                                  </div>
                              </ng-container>
                          </div>
                      </ng-container>
                  </div>
              </div>
          </div>
          <a *ngIf="filteredSandboxMenuItems && filteredSandboxMenuItems.length > 0" class="command-bar__brand"
             href="http://www.angularplayground.it/" target="_blank">
              <ap-logo></ap-logo>
          </a>
      </div>
      <section class="content">
          <ap-drawer *ngIf="activeMiddleware.overlay" (openCommandBarClick)="toggleCommandBar()" [class.content__menu--hide]="commandBarActive" class="content__menu"></ap-drawer>
          <div class="content__none" *ngIf="!selectedSandboxAndScenarioKeys.sandboxKey">
              <div class="content__none-message">
                  <p *ngIf="totalSandboxes > 0">
                      The playground has {{totalSandboxes}} sandboxed component{{totalSandboxes > 1 ? 's' : ''}}
                  </p>
                  <p *ngIf="totalSandboxes === 0">
                      Get started - create your first sandbox! <a href="http://www.angularplayground.it/docs/how-to/sandboxing-components" target="_blank">Click here</a>.
                  </p>
                  <!--
                  <div class="content__shortcuts">
                      <div class="content__shortcut" *ngFor="let shortcut of shortcuts">
                          <div class="content__shortcut-label">
                              <ng-container *ngFor="let key of shortcut.keys; let i = index">
                                  <code>
                                      {{key}}
                                  </code>
                                  <ng-container *ngIf="shortcut.keys.length > 1 && i < shortcut.keys.length - 1">&nbsp;&nbsp;/&nbsp;&nbsp;</ng-container>
                              </ng-container>
                          </div>
                          <div class="content__shortcut-value">
                              {{shortcut.description}}
                          </div>
                      </div>
                  </div>
              -->
              </div>
          </div>
          <ng-container *ngIf="selectedSandboxAndScenarioKeys.sandboxKey">
              <ap-scenario [selectedSandboxAndScenarioKeys]="selectedSandboxAndScenarioKeys"></ap-scenario>
          </ng-container>
      </section>
    `,
        styles: [`
          /* Globals */
          * {
            box-sizing: border-box;
          }

          :host {
            display: flex;
            flex-direction: row;
            justify-content: flex-start;
          }

          /* Shield */
          .shield {
            height: 100vh;
            opacity: 0;
            position: absolute;
            z-index: 2;
            width: 100%;
          }

          /* Command Bar */
          .command-bar {
            background-color: #252526;
            box-shadow: 0 3px 8px 5px black;
            color: white;
            display: flex;
            flex-direction: column;
            font-family: Consolas, monospace;
            left: 188px;
            margin-right: 10px;
            margin-top: -6px;
            padding-top: 10px;
            position: relative;
            transform: translate(-50%, -120%);
            transition: transform ease 100ms, opacity ease 100ms;
            width: 376px;
            /*
            z-index: 9999999999999;
            */
          }

          .command-bar::before {
            border-bottom: solid 1px black;
            content: "";
            display: block;
            position: relative;
            top: 52px;
            width: 100%;
          }

          .command-bar--open {
            min-height: 60px;
            transform: translate(-50%, 0);
          }

          .command-bar--preview {
            opacity: .7;
          }

          .command-bar__filter {
            background-color: #3c3c3c;
            border: 1px solid #174a6c;
            color: white;
            font-family: Consolas, monospace;
            font-size: 16px;
            margin: 6px 0 10px 5px;
            padding: 8px;
            width: 365px;
            z-index: 1;
          }

          .command-bar__filter::placeholder {
            color: #a9a9a9;
          }

          .command-bar__filter:-ms-input-placeholder {
            color: #a9a9a9;
          }

          .command-bar__filter::-moz-focus-inner {
            border: 0;
            padding: 0;
          }

          /* Categories */
          .command-bar__categories {
              overflow: auto;
              max-height: calc(100vh - 109px);
          }

          .command-bar__categories::-webkit-scrollbar {
              background-color: transparent;
              width: 6px;
          }
  
            .command-bar__categories::-webkit-scrollbar-track {
              border-left: solid 1px black;
              background: rgba(255, 255, 255, 0.1);
          }
  
            .command-bar__categories::-webkit-scrollbar-thumb  {
              background-color: rgba(255, 255, 255, 0.1);
              margin-left: 2px;
              width: 4px;
          }

          .command-bar__category {
              margin-top: 9px;
          }

          .command-bar__category__title {
              padding: 5px;
          }

          .command-bar__category__name {
              color: rgba(255, 255, 255, .8);
              font-family: Consolas, monospace;
              font-size: 16px;
              margin: 0;
          }

          .command-bar__category__name:hover,
          .command-bar__category__name:active,
          .command-bar__category__name:focus {
            opacity: 0.8;
            outline-style: none;
            cursor: pointer;
          }

          /* Sandboxes */
          .command-bar__sandboxes {
            border-top: solid 1px rgba(255, 255, 255, .1);
            /*overflow: auto;*/
            position: relative;
          }

          .command-bar__sandbox {
            border-bottom: solid 1px black;
            border-top: solid 1px rgba(255, 255, 255, .1);
            padding: 8px 6px 4px;
          }
    
          .command-bar__sandbox:hover,
          .command-bar__sandbox:active,
          .command-bar__sandbox:focus {
            background-color: #202020;
            color: white;
            outline-style: none;
            cursor: default;
          }

          .command-bar__sandbox:first-child {
            border-top: none;
          }

          .command-bar__sandbox:last-child {
            border-bottom: none;
            padding-bottom: 3px;
          }

          .command-bar__title {
            /*align-items: center;*/
            color: rgba(255, 255, 255, .6);
            display: flex;
            font-family: Consolas, monospace;
            font-size: 12px;
            font-weight: normal;
            justify-content: space-between;
            margin: 0;
            padding: 5px 0 0;
          }

          .command-bar__title ::ng-deep mark {
            background: transparent;
            color: #0097fb;
            font-weight: bold;
          }

          .command-bar__name {
            max-width: 100%;
            overflow: hidden;
            text-overflow: ellipsis;
            white-space: nowrap;
          }

          .command-bar__label {
            background: rgba(255, 255, 255, .1);
            border-radius: 2px;
            display: block;
            font-size: 10px;
            margin-left: 10px;
            padding: 4px 5px 3px;
            text-decoration: none;
            color: #3195bf;
            border: solid 1px #252526;
          }

          .command-bar__label:hover,
          .command-bar__label:active,
          .command-bar__label:focus {
            opacity: 0.9;
            outline-style: none;
            border: solid 1px #666666;
          }

          /* Scenario Groups */

          .command-bar__sandbox__group {
              padding: 3px 10px 3px 3px;
              display: inline-block;
          }

          .command-bar__sandbox__group__title {
              color: rgba(255, 255, 255, .4);
              font-family: Consolas, monospace;
              font-size: 12px;
              margin: 0;
          }

          .command-bar__sandbox__group__title:hover,
          .command-bar__sandbox__group__title:active,
          .command-bar__sandbox__group__title:focus {
              opacity: 0.8;
              outline-style: none;
              cursor: pointer;
          }

          .command-bar__sandbox__groups{
              margin: 3px;
          }

          /* Scenarios */
          .command-bar__scenarios {
            /*
            display: flex;
            */
          }

          .command-bar__scenario-link {
            align-items: center;
            border-radius: 2px;
            color: rgba(255, 255, 255, .5);
            cursor: pointer;
            display: flex;
            padding: 4px 3px;
            width: 100%;
          }

          .command-bar__scenario-link:hover,
          .command-bar__scenario-link:active,
          .command-bar__scenario-link:focus {
            background-color: #0097fb;
            color: white;
            outline-style: none;
          }

          .command-bar__scenario-link:hover .command-bar__scenario-icon,
          .command-bar__scenario-link:active .command-bar__scenario-icon,
          .command-bar__scenario-link:focus .command-bar__scenario-icon {
            opacity: .5;
          }

          .command-bar__scenario-label {
            line-height: 1;
            max-width: calc(100% - 26px);
            min-width: calc(100% - 26px);
            padding-bottom: 2px;
          }

          .command-bar__scenario-link--selected {
            background: rgba(255, 255, 255, .1);
            color: white;
          }

          .command-bar__scenario-link:hover .command-bar__scenario-icon--selected,
          .command-bar__scenario-link:active .command-bar__scenario-icon--selected,
          .command-bar__scenario-link:focus .command-bar__scenario-icon--selected {
            fill: white;
          }

          /* Brand */
          .command-bar__brand {
            border-top: solid 1px black;
            display: block;
            position: relative;
            padding: 9px 0 3px;
            text-align: center;
          }

          .command-bar__brand::before {
            border-bottom: solid 1px rgba(255, 255, 255, .1);
            content: "";
            display: block;
            left: 0;
            position: absolute;
            top: 0;
            width: 100%;
          }

          .command-bar__brand:hover .command-bar__logo__box {
            fill: rgba(255, 255, 255, .2);
          }

          .command-bar__brand:hover .command-bar__logo__letter {
            fill: rgba(255, 255, 255, .75);
          }

          /* Content */
          .content {
              display: flex;
              height: 100vh;
          }


          .content__none {
            /*
            align-items: center;
            */
            border: 0;
            display: flex;
            min-height: calc(100vh - 4em);
            justify-content: center;
            padding-top: 2em;
            padding-bottom: 2em;
            position: relative;
            width: 100%;
          }

          .content__none-message {
            font-family: Arial, sans-serif;
            max-width: 50%;
            min-width: 450px;
            text-align: center;
          }

          .content__none-message em {
            color: #666;
          }

          .content__none-message p {
            font-size: 20px;
          }

          .content__shortcuts {
            border-top: solid 1px #ccc;
            margin-top: 2em;
            padding: 30px 0 0 100px;
            width: 520px;
          }

          .content__shortcut {
            display: flex;
          }

          .content__shortcut-label {
            align-items: center;
            display: flex;
            font-size: 11px;
            justify-content: flex-end;
            max-width: 150px;
            min-width: 150px;
            padding: 8px 12px 8px 0;
            white-space: nowrap;
          }

          .content__shortcut-label code {
            background: #eee;
            border: solid 1px #ccc;
            border-radius: 4px;
            padding: 3px 7px;
          }

          .content__shortcut-value {
            align-items: center;
            display: flex;
            font-size: 11px;
            line-height: 1.75;
            text-align: left;
            white-space: nowrap;
          }
    `],
    }),
    __param(4, Inject(MIDDLEWARE)),
    __metadata("design:paramtypes", [StateService,
        UrlService,
        EventManager,
        LevenshteinDistance,
        Observable])
], AppComponent);
export { AppComponent };
//# sourceMappingURL=app.component.js.map