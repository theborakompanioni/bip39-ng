import { Component, OnInit, Inject, AfterViewInit, Input } from '@angular/core';
import { APP_CONFIG, AppConfig } from '../../config/app.config';
import { IAppConfig } from '../../config/iapp.config';
import { FormBuilder } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';

import * as Bip32 from 'bip32';
import * as Bip39 from 'bip39';

@Component({
  selector: 'app-main-wordlist',
  templateUrl: './main-wordlist.component.html',
  styleUrls: ['./main-wordlist.component.scss']
})
export class MainWordlistComponent implements OnInit {

  private fragment: string;
  private readonly language: string = Bip39.getDefaultWordlist();
  wordlist: string[] = Bip39.wordlists[this.language];

  constructor(@Inject(APP_CONFIG) public readonly appConfig: IAppConfig,
    private readonly router: Router,
    private readonly route: ActivatedRoute,
    private readonly formBuilder: FormBuilder) {
  }

  ngOnInit() {
    this.route.fragment.subscribe(fragment => { this.fragment = fragment; });

    console.log('wordlist');
  }
}
