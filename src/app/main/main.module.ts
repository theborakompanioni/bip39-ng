import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';

import {MainRoutingModule} from './main-routing.module';
import {SharedModule} from '../shared/modules/shared.module';

import {MainFrontComponent} from './main-front/main-front.component';
import {MainFaqComponent} from './main-faq/main-faq.component';
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
    MainFaqComponent,
  ],
  entryComponents: [
  ],
  providers: [
  ]
})

export class MainModule {
}
