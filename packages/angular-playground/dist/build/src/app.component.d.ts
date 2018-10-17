import { ElementRef, QueryList } from '@angular/core';
import { FormControl } from '@angular/forms';
import { EventManager } from '@angular/platform-browser';
import { SandboxMenuItem, SelectedSandboxAndScenarioKeys, ScenarioMenuItem } from '../lib/app-state';
import { StateService } from './shared/state.service';
import { UrlService } from './shared/url.service';
import { LevenshteinDistance } from './shared/levenshtein-distance';
import { Middleware } from '../lib/middlewares';
import { Observable } from 'rxjs';
export interface MenuCategories {
    name: string;
    visible: boolean;
    sandboxes: MenuSandboxes[];
}
export interface MenuSandboxes {
    name: string;
    visible: boolean;
    sandboxMenuItem: SandboxMenuItem;
    groups: MenuScenarioGroups[];
}
export interface MenuScenarioGroups {
    name: string;
    visible: boolean;
    scenarios: MenuScenarios[];
}
export interface MenuScenarios {
    name: string;
    scenarioMenuItem: ScenarioMenuItem;
}
export interface menuIndex {
    categoryIndex: number;
    sandboxIndex: number;
    groupIndex: number;
    scenarioIndex: number;
}
export declare class AppComponent {
    private stateService;
    private urlService;
    private eventManager;
    private levenshteinDistance;
    private middleware;
    scenarioLinkElements: QueryList<ElementRef>;
    commandBarActive: boolean;
    commandBarPreview: boolean;
    totalSandboxes: number;
    filteredSandboxMenuItems: SandboxMenuItem[];
    selectedSandboxAndScenarioKeys: SelectedSandboxAndScenarioKeys;
    filter: FormControl;
    shortcuts: {
        keys: string[];
        description: string;
    }[];
    activeMiddleware: Middleware;
    menuCategories: MenuCategories[];
    constructor(stateService: StateService, urlService: UrlService, eventManager: EventManager, levenshteinDistance: LevenshteinDistance, middleware: Observable<Middleware>);
    ngOnInit(): void;
    onFilterBoxArrowDown(event: any, switchToScenario?: boolean): void;
    onFilterBoxArrowUp(event: any, switchToScenario?: boolean): void;
    onScenarioLinkKeyDown(scenarioElement: any, filterElement: any, event: any): void;
    onScenarioLinkKeyUp(scenarioElement: any, event: any): void;
    onScenarioLinkControlDown(scenarioElement: any, event: any): void;
    onScenarioLinkControlUp(scenarioElement: any, event: any): void;
    onCommandBarStartPreview(event: any): void;
    onCommandBarStopPreview(): void;
    onScenarioClick(sandboxKey: string, scenarioKey: number, event: any): void;
    isSelected(sandbox: any, scenario: any): boolean;
    toggleCommandBar(): void;
    onCategoryClick(category: MenuCategories, event: any): void;
    onSandboxHeaderClick(sandbox: MenuSandboxes, event: any): void;
    onLabelClick(event: any): void;
    onGroupClick(group: MenuScenarioGroups, event: any): void;
    private blockEvent;
    private showScenario;
    private findCurrentScenarioIndex;
    private goUp;
    private goDown;
    private focusScenarioLinkElement;
    private findUniqueLabels;
    private getDocsUrl;
    private assignGroups;
    private filterSandboxes;
    private selectScenario;
    private getShortcuts;
    private expandSelectedScenario;
    private findItemByKey;
}
