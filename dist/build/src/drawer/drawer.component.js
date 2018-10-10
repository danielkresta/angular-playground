import { Component, EventEmitter, Output } from '@angular/core';
var DrawerComponent = /** @class */ (function () {
    function DrawerComponent() {
        this.openCommandBarClick = new EventEmitter();
    }
    DrawerComponent.prototype.openCommandBar = function () {
        this.openCommandBarClick.emit();
    };
    DrawerComponent.decorators = [
        { type: Component, args: [{
                    selector: 'ap-drawer',
                    template: "\n      <a\n          (click)=\"openCommandBar()\"\n          class=\"link\">\n          Menu\n      </a>\n    ",
                    styles: ["\n      .link {\n          align-items: center;\n          background: #252526;\n          border-radius: 50%;\n          bottom: 20px;\n          box-shadow: 0 0 8px 2px rgba(0, 0, 0, 0.5);\n          color: rgba(255, 255, 255, .5);\n          cursor: pointer;\n          display: flex;\n          flex-direction: column;\n          font-family: Arial, sans-serif;\n          font-size: 8px;\n          font-weight: bold;\n          height: 45px;\n          justify-content: center;\n          position: fixed;\n          right: 20px;\n          text-align: center;\n          text-transform: uppercase;\n          transition: transform ease 100ms, opacity ease 500ms;\n          width: 45px;\n          z-index: 10000;\n      }\n\n      .link::before {\n          background: linear-gradient(\n              to bottom, \n              rgba(255, 255, 255, .5), rgba(255, 255, 255, .5) 20%, \n              transparent 20%, transparent 40%, \n              rgba(255, 255, 255, .5) 40%, rgba(255, 255, 255, .5) 60%, \n              transparent 60%, transparent 80%, \n              rgba(255, 255, 255, .5) 80%, rgba(255, 255, 255, .5) 100%\n          );\n          content: '';\n          height: 10px;\n          margin-bottom: 4px;\n          width: 16px;\n      }\n\n      .link:hover {\n          transform: scale(1.15);\n      }\n\n      :host(.content__menu--hide) .link {\n          opacity: 0;\n      }\n    "]
                },] },
    ];
    DrawerComponent.propDecorators = {
        openCommandBarClick: [{ type: Output }]
    };
    return DrawerComponent;
}());
export { DrawerComponent };
//# sourceMappingURL=drawer.component.js.map