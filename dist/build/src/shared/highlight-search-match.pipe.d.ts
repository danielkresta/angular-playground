import { PipeTransform } from '@angular/core';
export declare class HighlightSearchMatchPipe implements PipeTransform {
    transform(value: string, indexMatches: number[], offset?: number): any;
}
