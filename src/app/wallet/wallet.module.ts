import {NgModule} from '@angular/core';

import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import {SharedModule} from '../shared/modules/shared.module';

import { WalletComponent } from './wallet.component';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    RouterModule,
    ReactiveFormsModule,
    SharedModule
  ],
  exports: [
    WalletComponent
  ],
  declarations: [
    WalletComponent
  ],
  entryComponents: [
  ],
  providers: [],
})

export class WalletModule {
}
