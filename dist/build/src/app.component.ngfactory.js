/**
 * @fileoverview This file was generated by the Angular template compiler. Do not edit.
 *
 * @suppress {suspiciousCode,uselessCode,missingProperties,missingOverride,checkTypes}
 * tslint:disable
 */ 
import * as i0 from "@angular/core";
import * as i1 from "./pin/pin.component.ngfactory";
import * as i2 from "./pin/pin.component";
import * as i3 from "@angular/common";
import * as i4 from "./shared/highlight-search-match.pipe";
import * as i5 from "./logo/logo.component.ngfactory";
import * as i6 from "./logo/logo.component";
import * as i7 from "@angular/forms";
import * as i8 from "./drawer/drawer.component.ngfactory";
import * as i9 from "./drawer/drawer.component";
import * as i10 from "./scenario/scenario.component.ngfactory";
import * as i11 from "./scenario/scenario.component";
import * as i12 from "../lib/middlewares";
import * as i13 from "./app.component";
import * as i14 from "./shared/state.service";
import * as i15 from "./shared/url.service";
import * as i16 from "@angular/platform-browser";
import * as i17 from "./shared/levenshtein-distance";
var styles_AppComponent = ["*[_ngcontent-%COMP%] {\n            box-sizing: border-box;\n          }\n\n          [_nghost-%COMP%] {\n            display: flex;\n            flex-direction: row;\n            justify-content: flex-start;\n          }\n\n          \n          .shield[_ngcontent-%COMP%] {\n            height: 100vh;\n            opacity: 0;\n            position: absolute;\n            z-index: 2;\n            width: 100%;\n          }\n\n          \n          .command-bar[_ngcontent-%COMP%] {\n            background-color: #252526;\n            box-shadow: 0 3px 8px 5px black;\n            color: white;\n            display: flex;\n            flex-direction: column;\n            font-family: Consolas, monospace;\n            left: 188px;\n            margin-right: 10px;\n            margin-top: -6px;\n            max-height: 100vh;\n            padding-top: 10px;\n            position: relative;\n            transform: translate(-50%, -120%);\n            transition: transform ease 100ms, opacity ease 100ms;\n            width: 376px;\n            \n          }\n\n          .command-bar[_ngcontent-%COMP%]::before {\n            border-bottom: solid 1px black;\n            content: \"\";\n            display: block;\n            position: relative;\n            top: 52px;\n            width: 100%;\n          }\n\n          .command-bar--open[_ngcontent-%COMP%] {\n            min-height: 60px;\n            transform: translate(-50%, 0);\n          }\n\n          .command-bar--preview[_ngcontent-%COMP%] {\n            opacity: .7;\n          }\n\n          .command-bar__filter[_ngcontent-%COMP%] {\n            background-color: #3c3c3c;\n            border: 1px solid #174a6c;\n            color: white;\n            font-family: Consolas, monospace;\n            font-size: 16px;\n            margin: 6px 0 10px 5px;\n            padding: 8px;\n            width: 365px;\n            z-index: 1;\n          }\n\n          .command-bar__filter[_ngcontent-%COMP%]::placeholder {\n            color: #a9a9a9;\n          }\n\n          .command-bar__filter[_ngcontent-%COMP%]:-ms-input-placeholder {\n            color: #a9a9a9;\n          }\n\n          .command-bar__filter[_ngcontent-%COMP%]::-moz-focus-inner {\n            border: 0;\n            padding: 0;\n          }\n\n          \n          .command-bar__categories[_ngcontent-%COMP%] {\n              overflow: auto;\n          }\n\n          .command-bar__categories[_ngcontent-%COMP%]::-webkit-scrollbar {\n              background-color: transparent;\n              width: 6px;\n          }\n  \n            .command-bar__categories[_ngcontent-%COMP%]::-webkit-scrollbar-track {\n              border-left: solid 1px black;\n              background: rgba(255, 255, 255, 0.1);\n          }\n  \n            .command-bar__categories[_ngcontent-%COMP%]::-webkit-scrollbar-thumb  {\n              background-color: rgba(255, 255, 255, 0.1);\n              margin-left: 2px;\n              width: 4px;\n          }\n\n          .command-bar__category[_ngcontent-%COMP%] {\n              margin-top: 9px;\n          }\n\n          .command-bar__category__title[_ngcontent-%COMP%] {\n              padding: 5px;\n          }\n\n          .command-bar__category__name[_ngcontent-%COMP%] {\n              color: rgba(255, 255, 255, .8);\n              font-family: Consolas, monospace;\n              font-size: 16px;\n              margin: 0;\n          }\n\n          .command-bar__category__name[_ngcontent-%COMP%]:hover, .command-bar__category__name[_ngcontent-%COMP%]:active, .command-bar__category__name[_ngcontent-%COMP%]:focus {\n            opacity: 0.8;\n            outline-style: none;\n            cursor: pointer;\n          }\n\n          \n          .command-bar__sandboxes[_ngcontent-%COMP%] {\n            border-top: solid 1px rgba(255, 255, 255, .1);\n            overflow: auto;\n            position: relative;\n            max-height: calc(100vh - 109px);\n          }\n\n          .command-bar__sandbox[_ngcontent-%COMP%] {\n            border-bottom: solid 1px black;\n            border-top: solid 1px rgba(255, 255, 255, .1);\n            padding: 8px 6px 4px;\n          }\n    \n          .command-bar__sandbox[_ngcontent-%COMP%]:hover, .command-bar__sandbox[_ngcontent-%COMP%]:active, .command-bar__sandbox[_ngcontent-%COMP%]:focus {\n            background-color: #202020;\n            color: white;\n            outline-style: none;\n            cursor: default;\n          }\n\n          .command-bar__sandbox[_ngcontent-%COMP%]:first-child {\n            border-top: none;\n          }\n\n          .command-bar__sandbox[_ngcontent-%COMP%]:last-child {\n            border-bottom: none;\n            padding-bottom: 3px;\n          }\n\n          .command-bar__title[_ngcontent-%COMP%] {\n            \n            color: rgba(255, 255, 255, .6);\n            display: flex;\n            font-family: Consolas, monospace;\n            font-size: 12px;\n            font-weight: normal;\n            justify-content: space-between;\n            margin: 0 0 5px;\n            padding: 5px 0 0;\n          }\n\n          .command-bar__title[_ngcontent-%COMP%]     mark {\n            background: transparent;\n            color: #0097fb;\n            font-weight: bold;\n          }\n\n          .command-bar__name[_ngcontent-%COMP%] {\n            max-width: 100%;\n            overflow: hidden;\n            text-overflow: ellipsis;\n            white-space: nowrap;\n          }\n\n          .command-bar__label[_ngcontent-%COMP%] {\n            background: rgba(255, 255, 255, .1);\n            border-radius: 2px;\n            display: block;\n            font-size: 10px;\n            margin-left: 10px;\n            padding: 4px 5px 3px;\n          }\n\n          \n\n          .command-bar__sandbox__group[_ngcontent-%COMP%] {\n              padding: 3px 10px 3px 3px;\n              display: inline-block;\n          }\n\n          .command-bar__sandbox__group__title[_ngcontent-%COMP%] {\n              color: rgba(255, 255, 255, .4);\n              font-family: Consolas, monospace;\n              font-size: 12px;\n              margin: 0;\n          }\n\n          .command-bar__sandbox__group__title[_ngcontent-%COMP%]:hover, .command-bar__sandbox__group__title[_ngcontent-%COMP%]:active, .command-bar__sandbox__group__title[_ngcontent-%COMP%]:focus {\n              opacity: 0.8;\n              outline-style: none;\n              cursor: pointer;\n          }\n\n          .command-bar__sandbox__groups[_ngcontent-%COMP%]{\n              margin: 3px;\n          }\n\n          \n          .command-bar__scenarios[_ngcontent-%COMP%] {\n            \n          }\n\n          .command-bar__scenario-link[_ngcontent-%COMP%] {\n            align-items: center;\n            border-radius: 2px;\n            color: rgba(255, 255, 255, .5);\n            cursor: pointer;\n            display: flex;\n            padding: 4px 3px;\n            width: 100%;\n          }\n\n          .command-bar__scenario-link[_ngcontent-%COMP%]:hover, .command-bar__scenario-link[_ngcontent-%COMP%]:active, .command-bar__scenario-link[_ngcontent-%COMP%]:focus {\n            background-color: #0097fb;\n            color: white;\n            outline-style: none;\n          }\n\n          .command-bar__scenario-link[_ngcontent-%COMP%]:hover   .command-bar__scenario-icon[_ngcontent-%COMP%], .command-bar__scenario-link[_ngcontent-%COMP%]:active   .command-bar__scenario-icon[_ngcontent-%COMP%], .command-bar__scenario-link[_ngcontent-%COMP%]:focus   .command-bar__scenario-icon[_ngcontent-%COMP%] {\n            opacity: .5;\n          }\n\n          .command-bar__scenario-label[_ngcontent-%COMP%] {\n            line-height: 1;\n            max-width: calc(100% - 26px);\n            min-width: calc(100% - 26px);\n            padding-bottom: 2px;\n          }\n\n          .command-bar__scenario-link--selected[_ngcontent-%COMP%] {\n            background: rgba(255, 255, 255, .1);\n            color: white;\n          }\n\n          .command-bar__scenario-link[_ngcontent-%COMP%]:hover   .command-bar__scenario-icon--selected[_ngcontent-%COMP%], .command-bar__scenario-link[_ngcontent-%COMP%]:active   .command-bar__scenario-icon--selected[_ngcontent-%COMP%], .command-bar__scenario-link[_ngcontent-%COMP%]:focus   .command-bar__scenario-icon--selected[_ngcontent-%COMP%] {\n            fill: white;\n          }\n\n          \n          .command-bar__brand[_ngcontent-%COMP%] {\n            border-top: solid 1px black;\n            display: block;\n            position: relative;\n            padding: 9px 0 3px;\n            text-align: center;\n          }\n\n          .command-bar__brand[_ngcontent-%COMP%]::before {\n            border-bottom: solid 1px rgba(255, 255, 255, .1);\n            content: \"\";\n            display: block;\n            left: 0;\n            position: absolute;\n            top: 0;\n            width: 100%;\n          }\n\n          .command-bar__brand[_ngcontent-%COMP%]:hover   .command-bar__logo__box[_ngcontent-%COMP%] {\n            fill: rgba(255, 255, 255, .2);\n          }\n\n          .command-bar__brand[_ngcontent-%COMP%]:hover   .command-bar__logo__letter[_ngcontent-%COMP%] {\n            fill: rgba(255, 255, 255, .75);\n          }\n\n          \n          .content[_ngcontent-%COMP%] {\n              display: flex;\n              height: 100vh;\n          }\n\n\n          .content__none[_ngcontent-%COMP%] {\n            \n            border: 0;\n            display: flex;\n            min-height: calc(100vh - 4em);\n            justify-content: center;\n            padding-top: 2em;\n            padding-bottom: 2em;\n            position: relative;\n            width: 100%;\n          }\n\n          .content__none-message[_ngcontent-%COMP%] {\n            font-family: Arial, sans-serif;\n            max-width: 50%;\n            min-width: 450px;\n            text-align: center;\n          }\n\n          .content__none-message[_ngcontent-%COMP%]   em[_ngcontent-%COMP%] {\n            color: #666;\n          }\n\n          .content__none-message[_ngcontent-%COMP%]   p[_ngcontent-%COMP%] {\n            font-size: 20px;\n          }\n\n          .content__shortcuts[_ngcontent-%COMP%] {\n            border-top: solid 1px #ccc;\n            margin-top: 2em;\n            padding: 30px 0 0 100px;\n            width: 520px;\n          }\n\n          .content__shortcut[_ngcontent-%COMP%] {\n            display: flex;\n          }\n\n          .content__shortcut-label[_ngcontent-%COMP%] {\n            align-items: center;\n            display: flex;\n            font-size: 11px;\n            justify-content: flex-end;\n            max-width: 150px;\n            min-width: 150px;\n            padding: 8px 12px 8px 0;\n            white-space: nowrap;\n          }\n\n          .content__shortcut-label[_ngcontent-%COMP%]   code[_ngcontent-%COMP%] {\n            background: #eee;\n            border: solid 1px #ccc;\n            border-radius: 4px;\n            padding: 3px 7px;\n          }\n\n          .content__shortcut-value[_ngcontent-%COMP%] {\n            align-items: center;\n            display: flex;\n            font-size: 11px;\n            line-height: 1.75;\n            text-align: left;\n            white-space: nowrap;\n          }"];
var RenderType_AppComponent = i0.ɵcrt({ encapsulation: 0, styles: styles_AppComponent, data: {} });
export { RenderType_AppComponent as RenderType_AppComponent };
function View_AppComponent_3(_l) { return i0.ɵvid(0, [(_l()(), i0.ɵeld(0, 0, null, null, 2, "div", [["class", "command-bar__category__title"]], null, null, null, null, null)), (_l()(), i0.ɵeld(1, 0, null, null, 1, "span", [["class", "command-bar__category__name"]], null, [[null, "click"]], function (_v, en, $event) { var ad = true; var _co = _v.component; if (("click" === en)) {
        var pd_0 = (_co.onCategoryClick(_v.parent.context.index) !== false);
        ad = (pd_0 && ad);
    } return ad; }, null, null)), (_l()(), i0.ɵted(2, null, [" ", " "]))], null, function (_ck, _v) { var currVal_0 = _v.parent.context.$implicit; _ck(_v, 2, 0, currVal_0); }); }
function View_AppComponent_9(_l) { return i0.ɵvid(0, [(_l()(), i0.ɵeld(0, 0, null, null, 2, "div", [["class", "command-bar__sandbox__group"]], null, [[null, "click"]], function (_v, en, $event) { var ad = true; var _co = _v.component; if (("click" === en)) {
        _co.onGroupClick(_v.parent.parent.parent.parent.context.index, _v.parent.context.index);
        var pd_0 = (_co.onSandboxHeaderClick(_v.parent.parent.parent.parent.context.index) !== false);
        ad = (pd_0 && ad);
    } return ad; }, null, null)), (_l()(), i0.ɵeld(1, 0, null, null, 1, "span", [["class", "command-bar__sandbox__group__title"]], null, null, null, null, null)), (_l()(), i0.ɵted(2, null, [" ", " "]))], null, function (_ck, _v) { var currVal_0 = _v.parent.context.$implicit; _ck(_v, 2, 0, currVal_0); }); }
function View_AppComponent_12(_l) { return i0.ɵvid(0, [(_l()(), i0.ɵeld(0, 0, [[1, 0], ["scenarioElement", 1]], null, 4, "a", [["class", "command-bar__scenario-link"]], [[8, "tabIndex", 0], [1, "sandboxMenuItemKey", 0], [1, "scenarioMenuItemkey", 0], [2, "command-bar__scenario-link--selected", null]], [[null, "keydown.control.arrowup"], [null, "keydown.control.arrowdown"], [null, "keydown.arrowup"], [null, "keydown.arrowdown"], [null, "keydown.esc"], [null, "keydown.enter"], [null, "keyup.esc"], [null, "keyup.enter"], [null, "click"]], function (_v, en, $event) { var ad = true; var _co = _v.component; if (("keydown.control.arrowup" === en)) {
        var pd_0 = (_co.onScenarioLinkControlUp(i0.ɵnov(_v, 0), $event) !== false);
        ad = (pd_0 && ad);
    } if (("keydown.control.arrowdown" === en)) {
        var pd_1 = (_co.onScenarioLinkControlDown(i0.ɵnov(_v, 0), $event) !== false);
        ad = (pd_1 && ad);
    } if (("keydown.arrowup" === en)) {
        var pd_2 = (_co.onScenarioLinkKeyDown(i0.ɵnov(_v, 0), i0.ɵnov(_v.parent.parent.parent.parent.parent.parent.parent.parent.parent, 1), $event) !== false);
        ad = (pd_2 && ad);
    } if (("keydown.arrowdown" === en)) {
        var pd_3 = (_co.onScenarioLinkKeyDown(i0.ɵnov(_v, 0), i0.ɵnov(_v.parent.parent.parent.parent.parent.parent.parent.parent.parent, 1), $event) !== false);
        ad = (pd_3 && ad);
    } if (("keydown.esc" === en)) {
        var pd_4 = (_co.onScenarioLinkKeyDown(i0.ɵnov(_v, 0), i0.ɵnov(_v.parent.parent.parent.parent.parent.parent.parent.parent.parent, 1), $event) !== false);
        ad = (pd_4 && ad);
    } if (("keydown.enter" === en)) {
        var pd_5 = (_co.onScenarioLinkKeyDown(i0.ɵnov(_v, 0), i0.ɵnov(_v.parent.parent.parent.parent.parent.parent.parent.parent.parent, 1), $event) !== false);
        ad = (pd_5 && ad);
    } if (("keyup.esc" === en)) {
        var pd_6 = (_co.onScenarioLinkKeyUp(i0.ɵnov(_v, 0), $event) !== false);
        ad = (pd_6 && ad);
    } if (("keyup.enter" === en)) {
        var pd_7 = (_co.onScenarioLinkKeyUp(i0.ɵnov(_v, 0), $event) !== false);
        ad = (pd_7 && ad);
    } if (("click" === en)) {
        _co.onScenarioClick(_v.parent.parent.parent.parent.parent.parent.context.$implicit.key, _v.parent.context.$implicit.key, $event);
        _co.toggleCommandBar();
        var pd_8 = (_co.onSandboxHeaderClick(_v.parent.parent.parent.parent.parent.parent.context.index) !== false);
        ad = (pd_8 && ad);
    } return ad; }, null, null)), (_l()(), i0.ɵeld(1, 0, null, null, 1, "ap-pin", [], null, null, null, i1.View_PinComponent_0, i1.RenderType_PinComponent)), i0.ɵdid(2, 49152, null, 0, i2.PinComponent, [], { selected: [0, "selected"] }, null), (_l()(), i0.ɵeld(3, 0, null, null, 1, "span", [["class", "command-bar__scenario-label"]], null, null, null, null, null)), (_l()(), i0.ɵted(4, null, [" ", " "]))], function (_ck, _v) { var _co = _v.component; var currVal_4 = _co.isSelected(_v.parent.parent.parent.parent.parent.parent.context.$implicit, _v.parent.context.$implicit); _ck(_v, 2, 0, currVal_4); }, function (_ck, _v) { var _co = _v.component; var currVal_0 = _v.parent.context.$implicit.tabIndex; var currVal_1 = _v.parent.parent.parent.parent.parent.parent.context.$implicit.key; var currVal_2 = _v.parent.context.$implicit.key; var currVal_3 = _co.isSelected(_v.parent.parent.parent.parent.parent.parent.context.$implicit, _v.parent.context.$implicit); _ck(_v, 0, 0, currVal_0, currVal_1, currVal_2, currVal_3); var currVal_5 = _v.parent.context.$implicit.description; _ck(_v, 4, 0, currVal_5); }); }
function View_AppComponent_11(_l) { return i0.ɵvid(0, [(_l()(), i0.ɵeld(0, 0, null, null, 2, null, null, null, null, null, null, null)), (_l()(), i0.ɵand(16777216, null, null, 1, null, View_AppComponent_12)), i0.ɵdid(2, 16384, null, 0, i3.NgIf, [i0.ViewContainerRef, i0.TemplateRef], { ngIf: [0, "ngIf"] }, null), (_l()(), i0.ɵand(0, null, null, 0))], function (_ck, _v) { var _co = _v.component; var currVal_0 = (_co.groupContainsScenario(_co.uniqueGroups[_v.parent.parent.parent.parent.parent.context.index].groupItems[_v.parent.parent.context.index], _v.context.$implicit.description) || ((_co.uniqueGroups[_v.parent.parent.parent.parent.parent.context.index].uniqueGroups.length === 1) && (_v.parent.parent.context.$implicit === "default"))); _ck(_v, 2, 0, currVal_0); }, null); }
function View_AppComponent_10(_l) { return i0.ɵvid(0, [(_l()(), i0.ɵeld(0, 0, null, null, 2, "div", [["class", "command-bar__scenarios"]], null, null, null, null, null)), (_l()(), i0.ɵand(16777216, null, null, 1, null, View_AppComponent_11)), i0.ɵdid(2, 278528, null, 0, i3.NgForOf, [i0.ViewContainerRef, i0.TemplateRef, i0.IterableDiffers], { ngForOf: [0, "ngForOf"] }, null)], function (_ck, _v) { var currVal_0 = _v.parent.parent.parent.parent.context.$implicit.scenarioMenuItems; _ck(_v, 2, 0, currVal_0); }, null); }
function View_AppComponent_8(_l) { return i0.ɵvid(0, [(_l()(), i0.ɵeld(0, 0, null, null, 4, "div", [["class", "command-bar__sandbox__groups"]], null, null, null, null, null)), (_l()(), i0.ɵand(16777216, null, null, 1, null, View_AppComponent_9)), i0.ɵdid(2, 16384, null, 0, i3.NgIf, [i0.ViewContainerRef, i0.TemplateRef], { ngIf: [0, "ngIf"] }, null), (_l()(), i0.ɵand(16777216, null, null, 1, null, View_AppComponent_10)), i0.ɵdid(4, 16384, null, 0, i3.NgIf, [i0.ViewContainerRef, i0.TemplateRef], { ngIf: [0, "ngIf"] }, null)], function (_ck, _v) { var _co = _v.component; var currVal_0 = ((_co.uniqueGroups[_v.parent.parent.parent.context.index].uniqueGroups.length > 1) || ((_co.uniqueGroups[_v.parent.parent.parent.context.index].uniqueGroups.length === 1) && (_v.context.$implicit !== "default"))); _ck(_v, 2, 0, currVal_0); var currVal_1 = _co.scenariosVisible[_v.parent.parent.parent.context.index][_v.context.index]; _ck(_v, 4, 0, currVal_1); }, null); }
function View_AppComponent_7(_l) { return i0.ɵvid(0, [(_l()(), i0.ɵeld(0, 0, null, null, 2, null, null, null, null, null, null, null)), (_l()(), i0.ɵand(16777216, null, null, 1, null, View_AppComponent_8)), i0.ɵdid(2, 278528, null, 0, i3.NgForOf, [i0.ViewContainerRef, i0.TemplateRef, i0.IterableDiffers], { ngForOf: [0, "ngForOf"] }, null), (_l()(), i0.ɵand(0, null, null, 0))], function (_ck, _v) { var _co = _v.component; var currVal_0 = _co.uniqueGroups[_v.parent.parent.context.index].uniqueGroups; _ck(_v, 2, 0, currVal_0); }, null); }
function View_AppComponent_6(_l) { return i0.ɵvid(0, [(_l()(), i0.ɵeld(0, 0, null, null, 5, "div", [["class", "command-bar__sandbox"]], null, [[null, "click"]], function (_v, en, $event) { var ad = true; var _co = _v.component; if (("click" === en)) {
        var pd_0 = (_co.onSandboxHeaderClick(_v.parent.context.index) !== false);
        ad = (pd_0 && ad);
    } return ad; }, null, null)), (_l()(), i0.ɵeld(1, 0, null, null, 2, "h2", [["class", "command-bar__title"]], [[8, "title", 0], [2, "command-bar__sandbox-title--selected", null]], null, null, null, null)), (_l()(), i0.ɵeld(2, 0, null, null, 1, "span", [["class", "command-bar__name"]], [[8, "innerHTML", 1]], null, null, null, null)), i0.ɵpid(0, i4.HighlightSearchMatchPipe, []), (_l()(), i0.ɵand(16777216, null, null, 1, null, View_AppComponent_7)), i0.ɵdid(5, 16384, null, 0, i3.NgIf, [i0.ViewContainerRef, i0.TemplateRef], { ngIf: [0, "ngIf"] }, null)], function (_ck, _v) { var _co = _v.component; var currVal_3 = _co.groupsVisible[_v.parent.context.index]; _ck(_v, 5, 0, currVal_3); }, function (_ck, _v) { var _co = _v.component; var currVal_0 = i0.ɵinlineInterpolate(2, "", _v.parent.context.$implicit.label, " ", _v.parent.context.$implicit.name, ""); var currVal_1 = (_co.selectedSandboxAndScenarioKeys.sandboxKey === _v.parent.context.$implicit.key); _ck(_v, 1, 0, currVal_0, currVal_1); var currVal_2 = i0.ɵunv(_v, 2, 0, i0.ɵnov(_v, 3).transform(_v.parent.context.$implicit.name, _v.parent.context.$implicit.indexMatches)); _ck(_v, 2, 0, currVal_2); }); }
function View_AppComponent_5(_l) { return i0.ɵvid(0, [(_l()(), i0.ɵeld(0, 0, null, null, 2, null, null, null, null, null, null, null)), (_l()(), i0.ɵand(16777216, null, null, 1, null, View_AppComponent_6)), i0.ɵdid(2, 16384, null, 0, i3.NgIf, [i0.ViewContainerRef, i0.TemplateRef], { ngIf: [0, "ngIf"] }, null), (_l()(), i0.ɵand(0, null, null, 0))], function (_ck, _v) { var currVal_0 = (_v.context.$implicit.label === _v.parent.parent.context.$implicit); _ck(_v, 2, 0, currVal_0); }, null); }
function View_AppComponent_4(_l) { return i0.ɵvid(0, [(_l()(), i0.ɵeld(0, 0, null, null, 2, "div", [["class", "command-bar__sandboxes"]], null, null, null, null, null)), (_l()(), i0.ɵand(16777216, null, null, 1, null, View_AppComponent_5)), i0.ɵdid(2, 278528, null, 0, i3.NgForOf, [i0.ViewContainerRef, i0.TemplateRef, i0.IterableDiffers], { ngForOf: [0, "ngForOf"] }, null)], function (_ck, _v) { var _co = _v.component; var currVal_0 = _co.filteredSandboxMenuItems; _ck(_v, 2, 0, currVal_0); }, null); }
function View_AppComponent_2(_l) { return i0.ɵvid(0, [(_l()(), i0.ɵeld(0, 0, null, null, 4, "div", [["class", "command-bar__category"]], null, null, null, null, null)), (_l()(), i0.ɵand(16777216, null, null, 1, null, View_AppComponent_3)), i0.ɵdid(2, 16384, null, 0, i3.NgIf, [i0.ViewContainerRef, i0.TemplateRef], { ngIf: [0, "ngIf"] }, null), (_l()(), i0.ɵand(16777216, null, null, 1, null, View_AppComponent_4)), i0.ɵdid(4, 16384, null, 0, i3.NgIf, [i0.ViewContainerRef, i0.TemplateRef], { ngIf: [0, "ngIf"] }, null)], function (_ck, _v) { var _co = _v.component; var currVal_0 = (_co.filteredSandboxMenuItems && (_co.filteredSandboxMenuItems.length > 0)); _ck(_v, 2, 0, currVal_0); var currVal_1 = ((_co.filteredSandboxMenuItems && (_co.filteredSandboxMenuItems.length > 0)) && _co.sandboxesVisible[_v.context.index]); _ck(_v, 4, 0, currVal_1); }, null); }
function View_AppComponent_13(_l) { return i0.ɵvid(0, [(_l()(), i0.ɵeld(0, 0, null, null, 2, "a", [["class", "command-bar__brand"], ["href", "http://www.angularplayground.it/"], ["target", "_blank"]], null, null, null, null, null)), (_l()(), i0.ɵeld(1, 0, null, null, 1, "ap-logo", [], null, null, null, i5.View_LogoComponent_0, i5.RenderType_LogoComponent)), i0.ɵdid(2, 49152, null, 0, i6.LogoComponent, [], null, null)], null, null); }
function View_AppComponent_1(_l) { return i0.ɵvid(0, [(_l()(), i0.ɵeld(0, 0, null, null, 11, "div", [["class", "command-bar command-bar--open"]], [[2, "command-bar--preview", null]], [[null, "keydown.control"], [null, "keyup.control"]], function (_v, en, $event) { var ad = true; var _co = _v.component; if (("keydown.control" === en)) {
        var pd_0 = (_co.onCommandBarStartPreview($event) !== false);
        ad = (pd_0 && ad);
    } if (("keyup.control" === en)) {
        var pd_1 = (_co.onCommandBarStopPreview() !== false);
        ad = (pd_1 && ad);
    } return ad; }, null, null)), (_l()(), i0.ɵeld(1, 0, [["filterElement", 1]], null, 5, "input", [["class", "command-bar__filter"], ["name", "filter"], ["placeholder", "search..."], ["type", "text"]], [[2, "ng-untouched", null], [2, "ng-touched", null], [2, "ng-pristine", null], [2, "ng-dirty", null], [2, "ng-valid", null], [2, "ng-invalid", null], [2, "ng-pending", null]], [[null, "keydown.arrowup"], [null, "keydown.arrowdown"], [null, "keydown.control.arrowup"], [null, "keydown.control.arrowdown"], [null, "input"], [null, "blur"], [null, "compositionstart"], [null, "compositionend"]], function (_v, en, $event) { var ad = true; var _co = _v.component; if (("input" === en)) {
        var pd_0 = (i0.ɵnov(_v, 2)._handleInput($event.target.value) !== false);
        ad = (pd_0 && ad);
    } if (("blur" === en)) {
        var pd_1 = (i0.ɵnov(_v, 2).onTouched() !== false);
        ad = (pd_1 && ad);
    } if (("compositionstart" === en)) {
        var pd_2 = (i0.ɵnov(_v, 2)._compositionStart() !== false);
        ad = (pd_2 && ad);
    } if (("compositionend" === en)) {
        var pd_3 = (i0.ɵnov(_v, 2)._compositionEnd($event.target.value) !== false);
        ad = (pd_3 && ad);
    } if (("keydown.arrowup" === en)) {
        var pd_4 = (_co.onFilterBoxArrowUp($event) !== false);
        ad = (pd_4 && ad);
    } if (("keydown.arrowdown" === en)) {
        var pd_5 = (_co.onFilterBoxArrowDown($event) !== false);
        ad = (pd_5 && ad);
    } if (("keydown.control.arrowup" === en)) {
        var pd_6 = (_co.onFilterBoxArrowUp($event, true) !== false);
        ad = (pd_6 && ad);
    } if (("keydown.control.arrowdown" === en)) {
        var pd_7 = (_co.onFilterBoxArrowDown($event, true) !== false);
        ad = (pd_7 && ad);
    } return ad; }, null, null)), i0.ɵdid(2, 16384, null, 0, i7.DefaultValueAccessor, [i0.Renderer2, i0.ElementRef, [2, i7.COMPOSITION_BUFFER_MODE]], null, null), i0.ɵprd(1024, null, i7.NG_VALUE_ACCESSOR, function (p0_0) { return [p0_0]; }, [i7.DefaultValueAccessor]), i0.ɵdid(4, 540672, null, 0, i7.FormControlDirective, [[8, null], [8, null], [6, i7.NG_VALUE_ACCESSOR], [2, i7.ɵangular_packages_forms_forms_j]], { form: [0, "form"] }, null), i0.ɵprd(2048, null, i7.NgControl, null, [i7.FormControlDirective]), i0.ɵdid(6, 16384, null, 0, i7.NgControlStatus, [[4, i7.NgControl]], null, null), (_l()(), i0.ɵeld(7, 0, null, null, 2, "div", [["class", "command-bar__categories"]], null, null, null, null, null)), (_l()(), i0.ɵand(16777216, null, null, 1, null, View_AppComponent_2)), i0.ɵdid(9, 278528, null, 0, i3.NgForOf, [i0.ViewContainerRef, i0.TemplateRef, i0.IterableDiffers], { ngForOf: [0, "ngForOf"] }, null), (_l()(), i0.ɵand(16777216, null, null, 1, null, View_AppComponent_13)), i0.ɵdid(11, 16384, null, 0, i3.NgIf, [i0.ViewContainerRef, i0.TemplateRef], { ngIf: [0, "ngIf"] }, null)], function (_ck, _v) { var _co = _v.component; var currVal_8 = _co.filter; _ck(_v, 4, 0, currVal_8); var currVal_9 = _co.uniqueLabels; _ck(_v, 9, 0, currVal_9); var currVal_10 = (_co.filteredSandboxMenuItems && (_co.filteredSandboxMenuItems.length > 0)); _ck(_v, 11, 0, currVal_10); }, function (_ck, _v) { var _co = _v.component; var currVal_0 = _co.commandBarPreview; _ck(_v, 0, 0, currVal_0); var currVal_1 = i0.ɵnov(_v, 6).ngClassUntouched; var currVal_2 = i0.ɵnov(_v, 6).ngClassTouched; var currVal_3 = i0.ɵnov(_v, 6).ngClassPristine; var currVal_4 = i0.ɵnov(_v, 6).ngClassDirty; var currVal_5 = i0.ɵnov(_v, 6).ngClassValid; var currVal_6 = i0.ɵnov(_v, 6).ngClassInvalid; var currVal_7 = i0.ɵnov(_v, 6).ngClassPending; _ck(_v, 1, 0, currVal_1, currVal_2, currVal_3, currVal_4, currVal_5, currVal_6, currVal_7); }); }
function View_AppComponent_14(_l) { return i0.ɵvid(0, [(_l()(), i0.ɵeld(0, 0, null, null, 1, "ap-drawer", [["class", "content__menu"]], [[2, "content__menu--hide", null]], [[null, "openCommandBarClick"]], function (_v, en, $event) { var ad = true; var _co = _v.component; if (("openCommandBarClick" === en)) {
        var pd_0 = (_co.toggleCommandBar() !== false);
        ad = (pd_0 && ad);
    } return ad; }, i8.View_DrawerComponent_0, i8.RenderType_DrawerComponent)), i0.ɵdid(1, 49152, null, 0, i9.DrawerComponent, [], null, { openCommandBarClick: "openCommandBarClick" })], null, function (_ck, _v) { var _co = _v.component; var currVal_0 = _co.commandBarActive; _ck(_v, 0, 0, currVal_0); }); }
function View_AppComponent_16(_l) { return i0.ɵvid(0, [(_l()(), i0.ɵeld(0, 0, null, null, 1, "p", [], null, null, null, null, null)), (_l()(), i0.ɵted(1, null, [" The playground has ", " sandboxed component", " "]))], null, function (_ck, _v) { var _co = _v.component; var currVal_0 = _co.totalSandboxes; var currVal_1 = ((_co.totalSandboxes > 1) ? "s" : ""); _ck(_v, 1, 0, currVal_0, currVal_1); }); }
function View_AppComponent_17(_l) { return i0.ɵvid(0, [(_l()(), i0.ɵeld(0, 0, null, null, 4, "p", [], null, null, null, null, null)), (_l()(), i0.ɵted(-1, null, [" Get started - create your first sandbox! "])), (_l()(), i0.ɵeld(2, 0, null, null, 1, "a", [["href", "http://www.angularplayground.it/docs/how-to/sandboxing-components"], ["target", "_blank"]], null, null, null, null, null)), (_l()(), i0.ɵted(-1, null, ["Click here"])), (_l()(), i0.ɵted(-1, null, [". "]))], null, null); }
function View_AppComponent_15(_l) { return i0.ɵvid(0, [(_l()(), i0.ɵeld(0, 0, null, null, 5, "div", [["class", "content__none"]], null, null, null, null, null)), (_l()(), i0.ɵeld(1, 0, null, null, 4, "div", [["class", "content__none-message"]], null, null, null, null, null)), (_l()(), i0.ɵand(16777216, null, null, 1, null, View_AppComponent_16)), i0.ɵdid(3, 16384, null, 0, i3.NgIf, [i0.ViewContainerRef, i0.TemplateRef], { ngIf: [0, "ngIf"] }, null), (_l()(), i0.ɵand(16777216, null, null, 1, null, View_AppComponent_17)), i0.ɵdid(5, 16384, null, 0, i3.NgIf, [i0.ViewContainerRef, i0.TemplateRef], { ngIf: [0, "ngIf"] }, null)], function (_ck, _v) { var _co = _v.component; var currVal_0 = (_co.totalSandboxes > 0); _ck(_v, 3, 0, currVal_0); var currVal_1 = (_co.totalSandboxes === 0); _ck(_v, 5, 0, currVal_1); }, null); }
function View_AppComponent_18(_l) { return i0.ɵvid(0, [(_l()(), i0.ɵeld(0, 0, null, null, 2, null, null, null, null, null, null, null)), (_l()(), i0.ɵeld(1, 0, null, null, 1, "ap-scenario", [], null, null, null, i10.View_ScenarioComponent_0, i10.RenderType_ScenarioComponent)), i0.ɵdid(2, 770048, null, 0, i11.ScenarioComponent, [i0.NgZone, i12.MIDDLEWARE], { selectedSandboxAndScenarioKeys: [0, "selectedSandboxAndScenarioKeys"] }, null)], function (_ck, _v) { var _co = _v.component; var currVal_0 = _co.selectedSandboxAndScenarioKeys; _ck(_v, 2, 0, currVal_0); }, null); }
export function View_AppComponent_0(_l) { return i0.ɵvid(0, [i0.ɵqud(671088640, 1, { scenarioLinkElements: 1 }), (_l()(), i0.ɵand(16777216, null, null, 1, null, View_AppComponent_1)), i0.ɵdid(2, 16384, null, 0, i3.NgIf, [i0.ViewContainerRef, i0.TemplateRef], { ngIf: [0, "ngIf"] }, null), (_l()(), i0.ɵeld(3, 0, null, null, 6, "section", [["class", "content"]], null, null, null, null, null)), (_l()(), i0.ɵand(16777216, null, null, 1, null, View_AppComponent_14)), i0.ɵdid(5, 16384, null, 0, i3.NgIf, [i0.ViewContainerRef, i0.TemplateRef], { ngIf: [0, "ngIf"] }, null), (_l()(), i0.ɵand(16777216, null, null, 1, null, View_AppComponent_15)), i0.ɵdid(7, 16384, null, 0, i3.NgIf, [i0.ViewContainerRef, i0.TemplateRef], { ngIf: [0, "ngIf"] }, null), (_l()(), i0.ɵand(16777216, null, null, 1, null, View_AppComponent_18)), i0.ɵdid(9, 16384, null, 0, i3.NgIf, [i0.ViewContainerRef, i0.TemplateRef], { ngIf: [0, "ngIf"] }, null)], function (_ck, _v) { var _co = _v.component; var currVal_0 = _co.filteredSandboxMenuItems; _ck(_v, 2, 0, currVal_0); var currVal_1 = _co.activeMiddleware.overlay; _ck(_v, 5, 0, currVal_1); var currVal_2 = !_co.selectedSandboxAndScenarioKeys.sandboxKey; _ck(_v, 7, 0, currVal_2); var currVal_3 = _co.selectedSandboxAndScenarioKeys.sandboxKey; _ck(_v, 9, 0, currVal_3); }, null); }
export function View_AppComponent_Host_0(_l) { return i0.ɵvid(0, [(_l()(), i0.ɵeld(0, 0, null, null, 1, "ap-root", [], null, null, null, View_AppComponent_0, RenderType_AppComponent)), i0.ɵdid(1, 114688, null, 0, i13.AppComponent, [i14.StateService, i15.UrlService, i16.EventManager, i17.LevenshteinDistance, i12.MIDDLEWARE], null, null)], function (_ck, _v) { _ck(_v, 1, 0); }, null); }
var AppComponentNgFactory = i0.ɵccf("ap-root", i13.AppComponent, View_AppComponent_Host_0, {}, {}, []);
export { AppComponentNgFactory as AppComponentNgFactory };
//# sourceMappingURL=app.component.ngfactory.js.map