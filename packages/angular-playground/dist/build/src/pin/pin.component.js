import { Component, Input } from '@angular/core';
var PinComponent = /** @class */ (function () {
    function PinComponent() {
    }
    PinComponent.decorators = [
        { type: Component, args: [{
                    selector: 'ap-pin',
                    template: "\n      <svg class=\"command-bar__scenario-icon\"\n          [class.command-bar__scenario-icon--selected]=\"selected\"\n          viewBox=\"25 25 50 50\">\n      <path\n          d=\"M70.32,34.393l-7.628-8.203c-0.854-0.916-2.256-1.066-3.281-0.342l-13.699,9.639c-0.479-0.055-0.956-0.082-1.425-0.082 c-5.935,0-9.126,4.326-9.259,4.51c-0.718,0.994-0.612,2.359,0.249,3.232l7.88,7.98L30.436,63.848c-0.98,0.98-0.98,2.568,0,3.549 c0.49,0.49,1.132,0.734,1.774,0.734c0.642,0,1.284-0.244,1.773-0.734l12.7-12.699l7.34,7.432c0.484,0.49,1.131,0.746,1.786,0.746 c0.436,0,0.874-0.113,1.27-0.346c4.014-2.357,3.876-9.373,3.557-12.727l9.799-12.125C71.22,36.707,71.171,35.307,70.32,34.393z M56.073,47.465c-0.432,0.535-0.626,1.225-0.536,1.906c0.332,2.51,0.239,5.236-0.146,7.002L40.678,41.475 c0.868-0.551,2.079-1.051,3.61-1.051c0.5,0,1.02,0.053,1.546,0.158c0.674,0.137,1.375-0.01,1.938-0.408l12.737-8.963l4.655,5.006 L56.073,47.465z\"></path>\n      </svg>\n    ",
                    styles: ["\n   .command-bar__scenario-icon {\n        display: inline-block;\n        fill: white;\n        height: 20px;\n        margin: 2px 6px 0 0;\n        opacity: .2;\n        width: 20px;\n    }\n\n    .command-bar__scenario-icon--selected {\n        fill: #0097fb;\n        opacity: 1;\n    }\n    "]
                },] },
    ];
    PinComponent.propDecorators = {
        selected: [{ type: Input }]
    };
    return PinComponent;
}());
export { PinComponent };
//# sourceMappingURL=pin.component.js.map