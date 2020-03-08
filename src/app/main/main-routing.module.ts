import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { MainFrontComponent } from './main-front/main-front.component';
import { MainFaqComponent } from './main-faq/main-faq.component';
import { MainWordlistComponent } from './main-wordlist/main-wordlist.component';
import { MainMnemonicsComponent } from './main-mnemonics/main-mnemonics.component';
import { MainComponent } from './main.component';

const mainRoutes: Routes = [
  {
    path: '',
    component: MainComponent,
    children: [
      { path: '', component: MainFrontComponent },
      { path: 'faq', component: MainFaqComponent },
      { path: 'mnemonics/:pageNumber', component: MainMnemonicsComponent },
      { path: 'mnemonics', redirectTo: '/mnemonics/0' },
      { path: 'wordlist', component: MainWordlistComponent },
    ]
  }
];

@NgModule({
  imports: [
    RouterModule.forChild(mainRoutes)
  ],
  exports: [
    RouterModule
  ]
})

export class MainRoutingModule {
}
