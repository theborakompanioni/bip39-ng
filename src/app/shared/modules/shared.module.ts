import {ModuleWithProviders, NgModule} from '@angular/core';
import {MaterialModule} from './material.module';
import {TranslateModule} from '@ngx-translate/core';
import {FlexLayoutModule} from '@angular/flex-layout';
import {MomentModule} from 'ngx-moment';

import { BitcoinPipe } from '../pipes/bitcoin.pipe';

@NgModule({
  imports: [
    MaterialModule,
    FlexLayoutModule,
    TranslateModule,
    MomentModule
  ],
  exports: [
    MaterialModule,
    FlexLayoutModule,
    TranslateModule,
    MomentModule,
    BitcoinPipe
  ],
  declarations: [
    BitcoinPipe
  ]
})

export class SharedModule {
  static forRoot(): ModuleWithProviders<SharedModule> {
    return {
      ngModule: SharedModule,
      providers: [
      ]
    };
  }
}
