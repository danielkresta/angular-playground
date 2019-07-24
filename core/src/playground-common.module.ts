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

declare let require: any;

@NgModule({
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
export class PlaygroundCommonModule {}
