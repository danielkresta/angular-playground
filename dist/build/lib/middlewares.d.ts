import { InjectionToken } from '@angular/core';
export interface Middleware {
    selector?: string;
    modules?: any[];
    overlay?: boolean;
}
export declare const MIDDLEWARE: InjectionToken<{}>;
