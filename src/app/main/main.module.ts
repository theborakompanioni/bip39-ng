import {NgModule} from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';

import {MainRoutingModule} from './main-routing.module';
import {SharedModule} from '../shared/modules/shared.module';
import {WalletModule} from '..//wallet/wallet.module';

import {MainFrontComponent } from './main-front/main-front.component';
import {MainFaqComponent, ScrollToTopButtonComponent} from './main-faq/main-faq.component';
import {MainWordlistComponent} from './main-wordlist/main-wordlist.component';
import { MainMnemonicsComponent } from './main-mnemonics/main-mnemonics.component';
import {MainComponent} from './main.component';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    RouterModule,
    ReactiveFormsModule,
    SharedModule,
    WalletModule,
    MainRoutingModule,
  ],
  declarations: [
    MainComponent,
    MainFrontComponent,
    MainFaqComponent,
    ScrollToTopButtonComponent,
    MainWordlistComponent,
    MainMnemonicsComponent
  ],
  entryComponents: [
  ],
  providers: [],
})

export class MainModule {
}
