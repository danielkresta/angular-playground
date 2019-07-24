var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
import { NgModule } from '@angular/core';
import { CommonModule, Location, LocationStrategy, PathLocationStrategy } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { ScenarioComponent } from './scenario/scenario.component';
import { StateService } from './shared/state.service';
import { FocusDirective } from './shared/focus.directive';
import { UrlService } from './shared/url.service';
import { AppComponent } from './app.component';
import { LevenshteinDistance } from './shared/levenshtein-distance';
import { HighlightSearchMatchPipe } from './shared/highlight-search-match.pipe';
import { LogoComponent } from './logo/logo.component';
import { PinComponent } from './pin/pin.component';
import { DrawerComponent } from './drawer/drawer.component';
let PlaygroundCommonModule = class PlaygroundCommonModule {
};
PlaygroundCommonModule = __decorate([
    NgModule({
        imports: [
            CommonModule,
            ReactiveFormsModule,
        ],
        providers: [
            Location,
            { provide: LocationStrategy, useClass: PathLocationStrategy },
            StateService,
            UrlService,
            LevenshteinDistance,
        ],
        declarations: [
            AppComponent,
            ScenarioComponent,
            FocusDirective,
            HighlightSearchMatchPipe,
            LogoComponent,
            PinComponent,
            DrawerComponent,
        ],
        exports: [AppComponent],
    })
], PlaygroundCommonModule);
export { PlaygroundCommonModule };
//# sourceMappingURL=playground-common.module.js.map