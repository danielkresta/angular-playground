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

export interface UniqueGroups {
    uniqueGroups: string[];
    groupItems: any[][];
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
    sandboxMenuItems: SandboxMenuItem[];
    uniqueLabels: string[] = [];
    sandboxesVisible: boolean[] = [];
    filteredSandboxMenuItems: SandboxMenuItem[];
    selectedSandboxAndScenarioKeys: SelectedSandboxAndScenarioKeys = { sandboxKey: null, scenarioKey: null };
    filter = new FormControl();
    shortcuts = this.getShortcuts();
    activeMiddleware: Middleware;
    groupsVisible: boolean[] = [];
    uniqueGroups: UniqueGroups[] = [];
    scenariosVisible: any[] = [];

    constructor(private stateService: StateService,
                private urlService: UrlService,
                private eventManager: EventManager,
                private levenshteinDistance: LevenshteinDistance,
                @Inject(MIDDLEWARE) private middleware: Observable<Middleware>) {
    }

    ngOnInit() {
        this.sandboxMenuItems = SandboxLoader.getSandboxMenuItems();

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

            this.uniqueLabels = this.findUniqueLabels( this.sandboxMenuItems );
            let filterValue = this.stateService.getFilter();
            this.totalSandboxes = this.sandboxMenuItems.length;
            this.filteredSandboxMenuItems = this.filterSandboxes(this.sandboxMenuItems, filterValue);
            this.filter.setValue(filterValue);
            this.filter.valueChanges.pipe
            (
                debounceTime(300),
                distinctUntilChanged()
            )
            .subscribe(value => {
                this.stateService.setFilter(value);
                this.filteredSandboxMenuItems = this.filterSandboxes(this.sandboxMenuItems, value);
                if (!value) {
                    this.selectScenario(null, null);
                }
            });

            for (let i = 0; i < this.filteredSandboxMenuItems.length; i++) {
                this.uniqueGroups[i] = this.findUniqueGroups( this.filteredSandboxMenuItems[i].scenarioMenuItems );
                this.scenariosVisible[i] = [] as boolean[];
                if ( this.uniqueGroups[i].uniqueGroups.length === 1 && this.uniqueGroups[i].uniqueGroups[0] === 'default' ) {
                    this.scenariosVisible[i][0] = true;
                }
                if ( this.filteredSandboxMenuItems[i].key === this.selectedSandboxAndScenarioKeys.sandboxKey ) {
                    this.expandSelectedScenario( this.selectedSandboxAndScenarioKeys, i );
            }
        }
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

    onCategoryClick( category: string ) {
        this.sandboxesVisible[category]  = !this.sandboxesVisible[category];
    }

    onSandboxHeaderClick(index: number) {
        this.groupsVisible[index]  = !this.groupsVisible[index];
    }

    onGroupClick(menuItemIndex, groupIndex) {
        this.scenariosVisible[menuItemIndex][groupIndex] = !this.scenariosVisible[menuItemIndex][groupIndex];
    }

    groupContainsScenario( groupItems: string[], scenario: string ): boolean {
        return ( groupItems.indexOf( scenario ) >= 0 ) ? true : false;
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

    private findUniqueLabels( sandboxMenuItems: SandboxMenuItem[] ): string[] {
        if ( sandboxMenuItems == null ) {
            return;
        }
        const uniqueLabels: string[] = sandboxMenuItems.reduce( (result, item ) => {
            item.label = item.label || 'Default';
            if (result.indexOf(item.label) === -1) {
                result.push(item.label)
            }
            return result;
        }, []);
        return uniqueLabels;
    }

    private findUniqueGroups( scenarioMenuItems: ScenarioMenuItem[] ): UniqueGroups {
        const groupsRegex = /\s*([^;]+)(?:[;,]\s*subgroup:([^;]+))?/;
        let groupItems: any[][] = [];
        let group: string;
        let description: string;
        const uniqueGroups: string[] = scenarioMenuItems.reduce( (result, item ) => {
            // String expected to contain encoded group and description
            [, description, group] = groupsRegex.exec( item.description )
            // reset regex
            groupsRegex.lastIndex = 0;
            item.description = description;
            // TODO: default group here or in the sender
            group = group === undefined ? 'default' : group;
            // Find if group already exists in the list
            let groupIndex = result.indexOf( group )
            if ( groupIndex === -1 ) {
                // Add the new group to the list
                result.push( group );
                groupIndex = result.length - 1;
                groupItems[groupIndex] = new Array();
            }
            // Add the scenario description to the group list
            groupItems[groupIndex].push( description );
            return result;
        }, []);
        return {
            uniqueGroups: uniqueGroups,
            groupItems: groupItems
        };
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

    private expandSelectedScenario( selected: SelectedSandboxAndScenarioKeys, sandboxIndex: number ) {
        // Find the index of Category/Label of the selected sandbox
        const categoryIndex = this.uniqueLabels.indexOf( this.filteredSandboxMenuItems[sandboxIndex].label );
        let groupIndex = 0;
        // Search through stored Scenario names to find the Group index
        for (let i = 0; i < this.uniqueGroups[sandboxIndex].groupItems.length; i++) {
            if ( 
                this.uniqueGroups[sandboxIndex].groupItems[i].indexOf( 
                    this.filteredSandboxMenuItems[sandboxIndex].scenarioMenuItems[ selected.scenarioKey - 1 ].description
                ) !== -1
            ) {
                groupIndex = i;
                break;
            }
        }
        // Enable the visibility of all the menu levels
        this.sandboxesVisible[categoryIndex] = true;
        this.groupsVisible[sandboxIndex] = true;
        this.scenariosVisible[sandboxIndex][groupIndex] = true;
    }
}
