import { Component, OnInit, Inject, AfterViewInit } from '@angular/core';
import { APP_CONFIG, AppConfig } from '../../config/app.config';
import { IAppConfig } from '../../config/iapp.config';
import { FormBuilder } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-main-faq',
  templateUrl: './main-faq.component.html',
  styleUrls: ['./main-faq.component.scss']
})
export class MainFaqComponent implements OnInit, AfterViewInit {

  private fragment: string;

  constructor(@Inject(APP_CONFIG) public appConfig: IAppConfig,
    private router: Router,
    private route: ActivatedRoute,
    private formBuilder: FormBuilder) {
  }

  ngOnInit() {
    this.route.fragment.subscribe(fragment => { this.fragment = fragment; });
  }

  ngAfterViewInit(): void {
    try {
      document.querySelector('#' + this.fragment).scrollIntoView({ behavior: 'smooth' });
    } catch (e) { }

    this.route.fragment.subscribe(fragment => {
      try {
        document.querySelector('#' + fragment).scrollIntoView({ behavior: 'smooth' });
      } catch (e) { }
    });
  }

}
