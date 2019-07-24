var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
import { Component, EventEmitter, Output } from '@angular/core';
let DrawerComponent = class DrawerComponent {
    constructor() {
        this.openCommandBarClick = new EventEmitter();
    }
    openCommandBar() {
        this.openCommandBarClick.emit();
    }
};
__decorate([
    Output(),
    __metadata("design:type", Object)
], DrawerComponent.prototype, "openCommandBarClick", void 0);
DrawerComponent = __decorate([
    Component({
        selector: 'ap-drawer',
        template: `
      <a
          (click)="openCommandBar()"
          class="link">
          Menu
      </a>
    `,
        styles: [`
      .link {
          align-items: center;
          background: #252526;
          border-radius: 50%;
          bottom: 20px;
          box-shadow: 0 0 8px 2px rgba(0, 0, 0, 0.5);
          color: rgba(255, 255, 255, .5);
          cursor: pointer;
          display: flex;
          flex-direction: column;
          font-family: Arial, sans-serif;
          font-size: 8px;
          font-weight: bold;
          height: 45px;
          justify-content: center;
          position: fixed;
          right: 20px;
          text-align: center;
          text-transform: uppercase;
          transition: transform ease 100ms, opacity ease 500ms;
          width: 45px;
          z-index: 10000;
      }

      .link::before {
          background: linear-gradient(
              to bottom,
              rgba(255, 255, 255, .5), rgba(255, 255, 255, .5) 20%,
              transparent 20%, transparent 40%,
              rgba(255, 255, 255, .5) 40%, rgba(255, 255, 255, .5) 60%,
              transparent 60%, transparent 80%,
              rgba(255, 255, 255, .5) 80%, rgba(255, 255, 255, .5) 100%
          );
          content: '';
          height: 10px;
          margin-bottom: 4px;
          width: 16px;
      }

      .link:hover {
          transform: scale(1.15);
      }

      :host(.content__menu--hide) .link {
          opacity: 0;
      }
    `],
    })
], DrawerComponent);
export { DrawerComponent };
//# sourceMappingURL=drawer.component.js.map