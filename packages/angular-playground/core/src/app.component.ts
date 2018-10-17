import { Component, ElementRef, Inject, QueryList, ViewChildren } from '@angular/core';
import { FormControl } from '@angular/forms';
import { EventManager } from '@angular/platform-browser';
import { SandboxMenuItem, SelectedSandboxAndScenarioKeys, ScenarioMenuItem } from '../lib/app-state';
import { StateService } from './shared/state.service';
import { UrlService } from './shared/url.service';
import { fuzzySearch } from './shared/fuzzy-search.function';
import { LevenshteinDistance } from './shared/levenshtein-distance';
import { SandboxLoader } from './shared/sandbox-loader';
import { Middleware, MIDDLEWARE } from '../lib/middlewares';
import { Observable } from 'rxjs';
import { debounceTime, distinctUntilChanged } from 'rxjs/operators';

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
    scenarios: MenuScenarios[]
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

@Component({
    selector: 'ap-root',
    templateUrl: './app.component.html',
    styleUrls: ['./app.component.css']
})
export class AppComponent {
    @ViewChildren('scenarioElement') scenarioLinkElements: QueryList<ElementRef>;
    commandBarActive = false;
    commandBarPreview = false;
    totalSandboxes: number;
    filteredSandboxMenuItems: SandboxMenuItem[];
    selectedSandboxAndScenarioKeys: SelectedSandboxAndScenarioKeys = { sandboxKey: null, scenarioKey: null };
    filter = new FormControl();
    shortcuts = this.getShortcuts();
    activeMiddleware: Middleware;
    menuCategories: MenuCategories[];

    constructor(private stateService: StateService,
                private urlService: UrlService,
                private eventManager: EventManager,
                private levenshteinDistance: LevenshteinDistance,
                @Inject(MIDDLEWARE) private middleware: Observable<Middleware>) {
    }

    ngOnInit() {
        const sandboxMenuItems = SandboxLoader.getSandboxMenuItems();

        this.middleware
            .subscribe(middleware => this.activeMiddleware = middleware);

        if (this.urlService.embed) {
            this.selectedSandboxAndScenarioKeys = {
                sandboxKey: this.urlService.select.sandboxKey,
                scenarioKey: this.urlService.select.scenarioKey
            };
        } else {
            if (this.urlService.select) {
                this.selectedSandboxAndScenarioKeys = {
                    sandboxKey: this.urlService.select.sandboxKey,
                    scenarioKey: this.urlService.select.scenarioKey
                };
            }

            this.eventManager.addGlobalEventListener('window', 'keydown.control.p', this.blockEvent);
            this.eventManager.addGlobalEventListener('window', 'keydown.F2', this.blockEvent);

            this.eventManager.addGlobalEventListener('window', 'keyup.control.p', (event: KeyboardEvent) => {
                this.blockEvent(event);
                this.toggleCommandBar();
            });

            this.eventManager.addGlobalEventListener('window', 'keyup.F2', (event: KeyboardEvent) => {
                this.blockEvent(event);
                this.toggleCommandBar();
            });

            let filterValue = this.stateService.getFilter();
            this.totalSandboxes = sandboxMenuItems.length;
            this.filteredSandboxMenuItems = this.filterSandboxes(sandboxMenuItems, filterValue);
            this.findUniqueLabels( sandboxMenuItems );
            this.expandSelectedScenario( this.selectedSandboxAndScenarioKeys );
            this.filter.setValue(filterValue);
            this.filter.valueChanges.pipe
            (
                debounceTime(300),
                distinctUntilChanged()
            )
            .subscribe(value => {
                this.stateService.setFilter(value);
                this.filteredSandboxMenuItems = this.filterSandboxes(sandboxMenuItems, value);
                this.findUniqueLabels( this.filteredSandboxMenuItems );
                console.log( this.menuCategories )
                if (!value) {
                    //this.selectScenario(null, null);
                }
            });
        }
    }

    onFilterBoxArrowDown(event: any, switchToScenario = false) {
        event.preventDefault();
        let elementRef;
        const currentIndex = this.findCurrentScenarioIndex();

        if (currentIndex) {
            elementRef = this.focusScenarioLinkElement(currentIndex + 1);
        } else {
            elementRef = this.focusScenarioLinkElement(0);
        }
        if (switchToScenario) {
            this.showScenario(elementRef);
        }
    }

    onFilterBoxArrowUp(event: any, switchToScenario = false) {
        event.preventDefault();
        let elementRef;
        const currentIndex = this.findCurrentScenarioIndex();

        if (currentIndex) {
            elementRef = this.focusScenarioLinkElement(currentIndex - 1);
        } else if (this.scenarioLinkElements.length > 0) {
            elementRef = this.focusScenarioLinkElement(this.scenarioLinkElements.length - 1);
        }
        if (switchToScenario) {
            this.showScenario(elementRef);
        }
    }

    onScenarioLinkKeyDown(scenarioElement: any, filterElement: any, event: any) {
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

    onScenarioLinkKeyUp(scenarioElement: any, event: any) {
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

    onScenarioLinkControlDown(scenarioElement: any, event: any) {
        if (!this.commandBarActive) return;
        event.preventDefault();
        let elementRef = this.goDown(scenarioElement);
        this.showScenario(elementRef);
    }

    onScenarioLinkControlUp(scenarioElement: any, event: any) {
        if (!this.commandBarActive) return;
        event.preventDefault();
        let elementRef = this.goUp(scenarioElement);
        this.showScenario(elementRef);
    }

    onCommandBarStartPreview(event: any) {
        event.preventDefault();
        this.commandBarPreview = true;
    }

    onCommandBarStopPreview() {
        this.commandBarPreview = false;
    }

    onScenarioClick(sandboxKey: string, scenarioKey: number, event: any) {
        event.stopPropagation();
        event.preventDefault();
        this.selectScenario(sandboxKey, scenarioKey);
    }

    isSelected(sandbox: any, scenario: any) {
        return this.selectedSandboxAndScenarioKeys.scenarioKey === scenario.key
            && this.selectedSandboxAndScenarioKeys.sandboxKey.toLowerCase() === sandbox.key.toLowerCase();
    }

    toggleCommandBar() {
        this.commandBarActive = !this.commandBarActive;
    }

    onCategoryClick( category: MenuCategories, event: any ) {
        event.stopPropagation();
        category.visible = !category.visible;
    }

    onSandboxHeaderClick( sandbox: MenuSandboxes, event: any ) {
        event.stopPropagation();
        sandbox.visible = !sandbox.visible;
    }

    onGroupClick( group: MenuScenarioGroups, event: any ) {
        event.stopPropagation();
        group.visible = !group.visible;
    }

    private blockEvent(e: KeyboardEvent) {
        e.preventDefault();
        e.stopPropagation();
    }

    private showScenario(selectedScenarioElementRef: ElementRef) {
        if (selectedScenarioElementRef) {
            this.selectScenario(
                selectedScenarioElementRef.nativeElement.getAttribute('sandboxMenuItemKey'),
                parseInt(selectedScenarioElementRef.nativeElement.getAttribute('scenarioMenuItemkey'), 10)
            );
        }
    }

    private findCurrentScenarioIndex(): number | undefined {
        let currentIndex;

        if (this.scenarioLinkElements.length > 0) {
            this.scenarioLinkElements.map((element: ElementRef, i: number) => {
                if (element.nativeElement.className.includes('selected')) {
                    currentIndex = i;
                }
            });
        }

        return currentIndex;
    }

    private goUp(scenarioElement: any) {
        let currentIndex = -1;

        this.scenarioLinkElements.forEach((scenarioElementRef: ElementRef, index: number) => {
            if (scenarioElementRef.nativeElement === scenarioElement) {
                currentIndex = index;
            }
        });

        if (currentIndex === 0) {
            return this.focusScenarioLinkElement(this.scenarioLinkElements.length - 1);
        } else {
            return this.focusScenarioLinkElement(currentIndex - 1);
        }
    }

    private goDown(scenarioElement: any) {
        let currentIndex = -1;

        this.scenarioLinkElements.forEach((scenarioElementRef: ElementRef, index: number) => {
            if (scenarioElementRef.nativeElement === scenarioElement) {
                currentIndex = index;
            }
        });

        if (currentIndex === this.scenarioLinkElements.length - 1) {
            return this.focusScenarioLinkElement(0);
        } else {
            return this.focusScenarioLinkElement(currentIndex + 1);
        }
    }

    private focusScenarioLinkElement(index: number) {
        if (this.scenarioLinkElements.toArray()[index]) {
            let elementRef = this.scenarioLinkElements.toArray()[index];
            elementRef.nativeElement.focus();
            return elementRef;
        }
    }

    private findUniqueLabels( sandboxMenuItems: SandboxMenuItem[] ): void {
        if ( sandboxMenuItems == null ) {
            return;
        }
        this.menuCategories = sandboxMenuItems.reduce( (result, item ) => {
            let categoryIndex = result.findIndex( obj => obj.name === item.label );
            let sandboxIndex: number;
            if ( categoryIndex === -1 ) {
                categoryIndex = result.length;
                sandboxIndex = 0;
                result.push({
                    name: item.label,
                    visible: true,
                    sandboxes: [{
                        name: item.name,
                        visible: false,
                        sandboxMenuItem: item,
                        groups: []
                    }]
                })
            } else if ( categoryIndex > -1 ) {
                sandboxIndex = result[categoryIndex].sandboxes.length;
                result[categoryIndex].sandboxes.push({
                    name: item.name,
                    visible: false,
                    sandboxMenuItem: item,
                    groups: []
                })
            }
            this.assignGroups( result[categoryIndex].sandboxes[sandboxIndex] );
            return result;
        }, []);
        return;
    }

    private assignGroups( sandbox: MenuSandboxes ): void {
        const groupsRegex = /\s*([^;]+)(?:[;,]\s*subgroup:([^;]+))?/;
        let group: string;
        let description: string;
        sandbox.sandboxMenuItem.scenarioMenuItems.forEach( item => {
            // String expected to contain encoded group and description
            [, description, group] = groupsRegex.exec( item.description )
            // reset regex
            groupsRegex.lastIndex = 0;
            group = group === undefined ? 'default' : group;
            // Find if group already exists in the list
            let groupIndex = sandbox.groups.findIndex( obj => obj.name === group );
            if ( groupIndex === -1 ) {
                groupIndex = sandbox.groups.length;
                sandbox.groups.push({
                    name: group,
                    visible: false,
                    scenarios: [{
                        name: description,
                        scenarioMenuItem: item
                    }]
                });
            } else if ( groupIndex > -1 ) {
                sandbox.groups[groupIndex].scenarios.push({
                    name: description,
                    scenarioMenuItem: item
                });
            }
        });
        return;
    }

    private filterSandboxes(sandboxMenuItems: SandboxMenuItem[], filter: string) {
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
                } else {
                    return accum;
                }
            }, [])
            .sort((a, b) => {
                return a.weight - b.weight;
            })
            .map(sandboxMenuItem => Object.assign({}, sandboxMenuItem, { tabIndex: tabIndex++ }));
    }

    private selectScenario(sandboxKey: string, scenarioKey: number) {
        this.selectedSandboxAndScenarioKeys = { sandboxKey, scenarioKey };
        this.urlService.setSelected(sandboxKey, scenarioKey);
    }

    private getShortcuts() {
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
    }

    private expandSelectedScenario( selected: SelectedSandboxAndScenarioKeys ): void {
        if ( selected.sandboxKey == null && selected.scenarioKey == null ) {
            return;
        }
        let index: menuIndex;
        index = this.findItemByKey( selected.sandboxKey, selected.scenarioKey );
        this.menuCategories[index.categoryIndex].visible = true;
        this.menuCategories[index.categoryIndex].sandboxes[index.sandboxIndex].visible = true;
        this.menuCategories[index.categoryIndex].sandboxes[index.sandboxIndex].groups[index.groupIndex].visible = true;
        return;
    }

    private findItemByKey( sandboxKey, scenarioKey? ): menuIndex {
        let categoryIndex = null;
        let sandboxIndex = null;
        let groupIndex = null;
        let scenarioIndex = null;
        for (categoryIndex = 0; categoryIndex < this.menuCategories.length; categoryIndex++) {
            sandboxIndex = this.menuCategories[categoryIndex].sandboxes.findIndex( obj => obj.sandboxMenuItem.key === sandboxKey );
            if ( sandboxIndex > -1 ) {
                break;
            }
        }
        if ( scenarioKey != null ) {
            const groups = this.menuCategories[categoryIndex].sandboxes[sandboxIndex].groups;
            for (groupIndex = 0; groupIndex < this.menuCategories.length; groupIndex++) {
                scenarioIndex = groups[groupIndex].scenarios.findIndex( obj => obj.scenarioMenuItem.key === scenarioKey );
                if ( scenarioIndex > -1 ) {
                    break;
                }
            }
        }
        return {
            categoryIndex: categoryIndex,
            sandboxIndex: sandboxIndex,
            groupIndex: groupIndex,
            scenarioIndex: scenarioIndex
        }
    }
}
