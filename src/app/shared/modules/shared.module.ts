import {ModuleWithProviders, NgModule} from '@angular/core';
import {MaterialModule} from './material.module';
import {TranslateModule} from '@ngx-translate/core';
import {FlexLayoutModule} from '@angular/flex-layout';
import {MomentModule} from 'ngx-moment';

@NgModule({
  imports: [
    MaterialModule,
    FlexLayoutModule,
    TranslateModule,
    MomentModule,
  ],
  exports: [
    MaterialModule,
    FlexLayoutModule,
    TranslateModule,
    MomentModule,
  ]
})

export class SharedModule {
  static forRoot(): ModuleWithProviders {
    return {
      ngModule: SharedModule,
      providers: [
      ]
    };
  }
}
