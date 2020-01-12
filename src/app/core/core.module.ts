import { NgModule, Optional, SkipSelf } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { throwIfAlreadyLoaded } from './module-import-guard';
import { NavComponent } from './nav/nav.component';
import { FooterComponent } from './footer/footer.component';
import { SharedModule } from '../shared/modules/shared.module';
import { RouterModule } from '@angular/router';
import { Error404Component } from './error404/error-404.component';
import { LoggerService } from './shared/logger.service';
import { ProgressBarService } from './shared/progress-bar.service';
import { BlockchainInfoServiceService } from './shared/blockchain-info-service.service';
import { BlockstreamInfoServiceService } from './shared/blockstream-info-service.service';
import { DataInfoServiceService } from './shared/data-info-service.service';



@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    RouterModule,
    SharedModule,
    ReactiveFormsModule
  ],
  exports: [
    NavComponent,
    FooterComponent
  ],
  declarations: [
    NavComponent,
    FooterComponent,
    Error404Component
  ],
  providers: [
    LoggerService,
    ProgressBarService,
    BlockchainInfoServiceService,
    BlockstreamInfoServiceService,
    DataInfoServiceService,
  ]
})

export class CoreModule {
  constructor(@Optional() @SkipSelf() parentModule: CoreModule) {
    throwIfAlreadyLoaded(parentModule, 'CoreModule');
  }
}
