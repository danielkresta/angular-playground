import { Pipe } from '@angular/core';
var HighlightSearchMatchPipe = /** @class */ (function () {
    function HighlightSearchMatchPipe() {
    }
    HighlightSearchMatchPipe.prototype.transform = function (value, indexMatches, offset) {
        if (offset === void 0) { offset = 0; }
        // Match null and undefined, but not 0 or ''
        if (value == null || indexMatches == null) {
            return value;
        }
        var transformedValue = '';
        var indexes = indexMatches.reduce(function (a, n) { return n >= offset ? a.concat([n - offset]) : a; }, []);
        var _loop_1 = function (i) {
            if (indexes.some(function (item) { return item === i; })) {
                transformedValue += "<mark>" + value[i] + "</mark>";
            }
            else {
                transformedValue += value[i];
            }
        };
        for (var i = 0; i < value.length; i++) {
            _loop_1(i);
        }
        return transformedValue;
    };
    HighlightSearchMatchPipe.decorators = [
        { type: Pipe, args: [{ name: 'apHighlightSearchMatch', pure: false },] },
    ];
    return HighlightSearchMatchPipe;
}());
export { HighlightSearchMatchPipe };
//# sourceMappingURL=highlight-search-match.pipe.js.map