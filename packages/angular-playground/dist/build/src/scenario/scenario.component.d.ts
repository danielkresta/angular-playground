import { NgZone, OnChanges, OnDestroy, OnInit, SimpleChanges } from '@angular/core';
import { SelectedSandboxAndScenarioKeys } from '../../lib/app-state';
export declare class ScenarioComponent implements OnInit, OnChanges, OnDestroy {
    private zone;
    private middleware;
    /**
     * The selected sandbox and scenario provided from the app dropdown
     */
    selectedSandboxAndScenarioKeys: SelectedSandboxAndScenarioKeys;
    /**
     * Collection of bootstrapped apps
     */
    private activeApps;
    /**
     * Modules that are applied across every sandbox instance
     */
    private activeMiddleware;
    /**
     * Unsubscribe all subscriptions on component destroy
     */
    private onDestroy;
    constructor(zone: NgZone, middleware: any);
    ngOnInit(): void;
    ngOnChanges(changes: SimpleChanges): void;
    ngOnDestroy(): void;
    /**
     * Bootstrap a new Angular application with the sandbox's required dependencies
     */
    private bootstrapSandbox;
    /**
     * Create a module containing the dependencies of a sandbox
     */
    private createModule;
    /**
     * Construct a component to serve as the host for the provided scenario
     */
    private createComponent;
}
