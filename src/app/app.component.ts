import {Component, OnInit} from '@angular/core';
import {TranslateService} from '@ngx-translate/core';
import {Meta, Title} from '@angular/platform-browser';
import {NavigationEnd, Router} from '@angular/router';
import {AppConfig} from './config/app.config';
import {MatSnackBar} from '@angular/material/snack-bar';

declare const Modernizr;

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html'
})
export class AppComponent implements OnInit {

  isOnline: boolean;

  constructor(private readonly translateService: TranslateService,
              private readonly title: Title,
              private readonly meta: Meta,
              private readonly snackBar: MatSnackBar,
              private readonly router: Router) {
    this.isOnline = navigator.onLine;
  }

  ngOnInit() {
    this.translateService.setDefaultLang('en');
    this.translateService.use('en');

    this.title.setTitle('Loading...');
    this.translateService.get(['applicationName']).subscribe((texts) => {
      this.title.setTitle(texts['applicationName']);
    });

    this.router.events.subscribe((event: any) => {
      if (event instanceof NavigationEnd) {
        switch (event.urlAfterRedirects) {
          case '/':
            this.meta.updateTag({
              name: 'description',
              content: 'bip39'
            });
            break;
        }
      }
    });

    this.checkBrowserFeatures();
  }

  checkBrowserFeatures() {
    let supported = true;
    for (const feature in Modernizr) {
      if (Modernizr.hasOwnProperty(feature) &&
        typeof Modernizr[feature] === 'boolean' && Modernizr[feature] === false) {
        supported = false;
        break;
      }
    }

    if (!supported) {
      this.translateService.get(['updateBrowser']).subscribe((texts) => {
        this.snackBar.open(texts['updateBrowser'], 'OK');
      });
    }

    return supported;
  }
}
