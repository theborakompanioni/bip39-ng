import {NgModule} from '@angular/core';
import {CommonModule, CurrencyPipe} from '@angular/common';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';

import {MainRoutingModule} from './main-routing.module';
import {SharedModule} from '../shared/modules/shared.module';

import {MainFrontComponent, BitcoinPipe} from './main-front/main-front.component';
import {MainFaqComponent, ScrollToTopButtonComponent} from './main-faq/main-faq.component';
import {MainWordlistComponent} from './main-wordlist/main-wordlist.component';
import { MainMnemonicsComponent } from './main-mnemonics/main-mnemonics.component';
import {MainComponent} from './main.component';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    SharedModule,
    MainRoutingModule,
    ReactiveFormsModule
  ],
  declarations: [
    MainComponent,
    MainFrontComponent,
    BitcoinPipe,
    MainFaqComponent,
    ScrollToTopButtonComponent,
    MainWordlistComponent,
    MainMnemonicsComponent
  ],
  entryComponents: [
  ],
  providers: [CurrencyPipe],
})

export class MainModule {
}
