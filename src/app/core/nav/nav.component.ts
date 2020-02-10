import { Component, Inject, OnInit } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';

import { APP_CONFIG, AppConfig } from '../../config/app.config';
import { IAppConfig } from '../../config/iapp.config';
import { ProgressBarService } from '../shared/progress-bar.service';

@Component({
  selector: 'app-nav',
  templateUrl: './nav.component.html',
  styleUrls: ['./nav.component.scss']
})

export class NavComponent implements OnInit {

  appConfig: any;
  menuItems: any[] = [];
  progressBarMode: string;
  currentLang: string;

  constructor(@Inject(APP_CONFIG) appConfig: IAppConfig,
    private readonly progressBarService: ProgressBarService,
    private readonly translateService: TranslateService) {
    this.appConfig = appConfig;
  }

  ngOnInit() {
    this.currentLang = this.translateService.currentLang;

    this.loadMenus();

    this.progressBarService.updateProgressBar$.subscribe((mode: string) => {
      this.progressBarMode = mode;
    });
  }

  changeLanguage(language: string): void {
    this.translateService.use(language).subscribe(() => {
      this.loadMenus();
    });
  }

  private loadMenus(): void {
    const defaultMenuItems = [
      { link: '/' + AppConfig.routes.home, name: 'home' },
      { link: '/' + AppConfig.routes.wordlist, name: 'wordlist' },
      { link: '/' + AppConfig.routes.faq, name: 'faq' },
    ];

    this.translateService.get(['home', 'faq', 'wordlist'], {}).subscribe((texts: any) => {
      this.menuItems = [
        { link: '/' + AppConfig.routes.home, name: texts['home'] },
        { link: '/' + AppConfig.routes.wordlist, name: texts['wordlist'] },
        { link: '/' + AppConfig.routes.faq, name: texts['faq'] },
      ];
    }, error => {
      this.menuItems = defaultMenuItems;
    }, () => {
      if (this.menuItems.length === 0) {
        this.menuItems = defaultMenuItems;
      }
    });
  }
}
