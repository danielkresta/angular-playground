var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
import { Pipe } from '@angular/core';
let HighlightSearchMatchPipe = class HighlightSearchMatchPipe {
    transform(value, indexMatches, offset = 0) {
        // Match null and undefined, but not 0 or ''
        if (value == null || indexMatches == null) {
            return value;
        }
        let transformedValue = '';
        let indexes = indexMatches.reduce((a, n) => n >= offset ? [...a, n - offset] : a, []);
        for (let i = 0; i < value.length; i++) {
            if (indexes.some(item => item === i)) {
                transformedValue += `<mark>${value[i]}</mark>`;
            }
            else {
                transformedValue += value[i];
            }
        }
        return transformedValue;
    }
};
HighlightSearchMatchPipe = __decorate([
    Pipe({ name: 'apHighlightSearchMatch', pure: false })
], HighlightSearchMatchPipe);
export { HighlightSearchMatchPipe };
//# sourceMappingURL=highlight-search-match.pipe.js.map