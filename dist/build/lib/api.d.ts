import { Sandbox } from './app-state';
export interface SandboxOfConfig {
    label?: string;
    imports?: any[];
    declarations?: any[];
    entryComponents?: any[];
    providers?: any[];
    schemas?: any[];
    declareComponent?: boolean;
}
export interface ScenarioConfig {
    template: string;
    styles?: string[];
    context?: any;
    providers?: any[];
}
export declare class SandboxBuilder {
    private _type;
    private _config;
    private _scenarios;
    private _scenarioCounter;
    constructor(_type: any, _config?: SandboxOfConfig);
    add(description: string, config: ScenarioConfig): this;
    serialize(sandboxPath: string): Sandbox;
}
export declare function sandboxOf(type: any, config?: SandboxOfConfig): SandboxBuilder;
