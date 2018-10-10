import { Location } from '@angular/common';
import { SandboxMenuItem } from '../../lib/app-state';
export declare class UrlService {
    private location;
    private _embed;
    private _select;
    sandboxMenuItems: SandboxMenuItem[];
    readonly embed: boolean;
    readonly select: any;
    constructor(location: Location);
    setSelected(sandboxKey: string, scenarioKey: number): void;
    private parse;
}
