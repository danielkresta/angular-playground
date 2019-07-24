import { Directive, Input, ElementRef } from '@angular/core';
var FocusDirective = /** @class */ (function () {
    function FocusDirective(elementRef) {
        this.elementRef = elementRef;
    }
    Object.defineProperty(FocusDirective.prototype, "apFocus", {
        set: function (value) {
            if (value) {
                this.elementRef.nativeElement.focus();
            }
        },
        enumerable: true,
        configurable: true
    });
    FocusDirective.decorators = [
        { type: Directive, args: [{
                    selector: '[apFocus]'
                },] },
    ];
    /** @nocollapse */
    FocusDirective.ctorParameters = function () { return [
        { type: ElementRef }
    ]; };
    FocusDirective.propDecorators = {
        apFocus: [{ type: Input }]
    };
    return FocusDirective;
}());
export { FocusDirective };
//# sourceMappingURL=focus.directive.js.map