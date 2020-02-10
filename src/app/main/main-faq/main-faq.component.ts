import { Component, OnInit, Inject, AfterViewInit, Input } from '@angular/core';
import { APP_CONFIG, AppConfig } from '../../config/app.config';
import { IAppConfig } from '../../config/iapp.config';
import { Router, ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-main-faq',
  templateUrl: './main-faq.component.html',
  styleUrls: ['./main-faq.component.scss']
})
export class MainFaqComponent implements OnInit, AfterViewInit {

  private fragment: string;

  constructor(@Inject(APP_CONFIG) public readonly appConfig: IAppConfig,
    private readonly router: Router,
    private readonly route: ActivatedRoute) {
  }

  ngOnInit() {
    this.route.fragment.subscribe(fragment => { this.fragment = fragment; });
  }

  ngAfterViewInit() {
    this.route.fragment.subscribe(fragment => {
        this.scrollToElement(fragment);
    });

    if (this.fragment) {
      this.scrollToElement(this.fragment);
    }
  }

  private scrollToElement(elementClass) {
    console.log('[DEBUG] scroll to #' + elementClass);
    try {
      document.querySelector('#' + elementClass).scrollIntoView({ behavior: 'smooth' });
    } catch (e) {
      console.log('[DEBUG] cannot scroll to #' + elementClass);
    }
  }
}


@Component({
  selector: 'app-scroll-to-top-button',
  template: `
  <a class="app-scroll-to-top-button"
     (click)="scroll()"
     aria-label="Scroll To Top"
     matTooltip="Scroll To Top"
     matTooltipPosition="above">
    <mat-icon aria-hidden="false" aria-label="Scroll To Top icon">arrow_upward</mat-icon>
  </a>
  `
})
export class ScrollToTopButtonComponent implements OnInit, AfterViewInit {

  @Input() elementClass: string;

  ngOnInit() {
  }

  ngAfterViewInit() {
  }

  scroll() {
    this.scrollToElement(this.elementClass);
  }

  private scrollToElement(elementClass) {
    console.log('[DEBUG] scroll to #' + elementClass);
    try {
      document.querySelector('#' + elementClass).scrollIntoView({ behavior: 'smooth' });
    } catch (e) {
      console.log('[DEBUG] cannot scroll to #' + elementClass);
    }
  }

}

