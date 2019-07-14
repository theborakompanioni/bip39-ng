(window["webpackJsonp"] = window["webpackJsonp"] || []).push([["main"],{

/***/ "./node_modules/raw-loader/index.js!./src/app/app.component.html":
/*!**************************************************************!*\
  !*** ./node_modules/raw-loader!./src/app/app.component.html ***!
  \**************************************************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = "<div>\n    <app-nav></app-nav>\n    <router-outlet *ngIf=\"isOnline;else isOffline\"></router-outlet>\n    <ng-template #isOffline>\n        <div>\n            <p class=\"offline-error\">{{'offlineMessage' | translate}}&nbsp;&nbsp;&nbsp;<span>:&nbsp;)</span></p>\n        </div>\n    </ng-template>\n</div>\n<app-footer></app-footer>"

/***/ }),

/***/ "./node_modules/raw-loader/index.js!./src/app/core/error404/error-404.component.html":
/*!**********************************************************************************!*\
  !*** ./node_modules/raw-loader!./src/app/core/error404/error-404.component.html ***!
  \**********************************************************************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = "<h1 class=\"header__title\">{{'error404' | translate}}</h1>\n<p class=\"explanation\">{{'mayTheForce' | translate}}</p>\n<img src=\"assets/images/404.gif\">"

/***/ }),

/***/ "./node_modules/raw-loader/index.js!./src/app/core/footer/footer.component.html":
/*!*****************************************************************************!*\
  !*** ./node_modules/raw-loader!./src/app/core/footer/footer.component.html ***!
  \*****************************************************************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = "<footer>\n    <div fxFlex fxLayout=\"row\" fxLayout.xs=\"column\" fxLayoutAlign=\"center center\"\n         class.xs=\"footer-xs\">\n        <div fxFlex=\"33\">\n            <span>{{ 'applicationName' | translate }}</span>\n        </div>\n        <div fxFlex=\"33\" class=\"text--center\">\n        </div>\n        <div fxFlex class=\"text--right\" class.xs=\"footer-xs\">\n        </div>\n    </div>\n</footer>\n"

/***/ }),

/***/ "./node_modules/raw-loader/index.js!./src/app/core/nav/nav.component.html":
/*!***********************************************************************!*\
  !*** ./node_modules/raw-loader!./src/app/core/nav/nav.component.html ***!
  \***********************************************************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = "<header>\n    <nav>\n        <div fxFlex fxLayout=\"row\" fxLayout.xs=\"column\" fxLayoutAlign=\"center center\">\n            <div fxFlex>\n                <a mat-raised-button *ngFor=\"let item of menuItems\" routerLink=\"{{item.link}}\">\n                    {{item.name | uppercase}}\n                </a>\n            </div>\n            <div fxFlex class=\"text--right\">\n                <!--button mat-icon-button [matMenuTriggerFor]=\"matmenu\">\n                    <mat-icon>public</mat-icon>\n                </button>\n                <mat-menu #matmenu=\"matMenu\">\n                    <button mat-menu-item (click)=\"changeLanguage('zh')\">\n                        <mat-icon>flag</mat-icon>\n                        <span>\n                            Chinese\n                        </span>\n                    </button>\n                    <button mat-menu-item (click)=\"changeLanguage('en')\">\n                        <mat-icon>flag</mat-icon>\n                        <span>\n                            English\n                        </span>\n                    </button>\n                    <button mat-menu-item (click)=\"changeLanguage('es')\">\n                        <mat-icon>flag</mat-icon>\n                        <span>\n                            Español\n                        </span>\n                    </button>\n                    <button mat-menu-item (click)=\"changeLanguage('pt-br')\">\n                        <mat-icon>flag</mat-icon>\n                        <span>\n                            Português\n                        </span>\n                    </button>\n                </mat-menu-->\n                <a class=\"icon__image\" href=\"{{appConfig.repositoryURL}}\" rel=\"noopener\">\n                    <img src=\"assets/images/github-circle-white-transparent.svg\">\n                </a>\n            </div>\n        </div>\n    </nav>\n    <section class=\"progress-bar\">\n        <mat-progress-bar [color]=\"'primary'\" [mode]=\"progressBarMode\">\n        </mat-progress-bar>\n    </section>\n</header>"

/***/ }),

/***/ "./node_modules/webpack/buildin/global.js":
/*!***********************************!*\
  !*** (webpack)/buildin/global.js ***!
  \***********************************/
/*! no static exports found */
/***/ (function(module, exports) {

var g;

// This works in non-strict mode
g = (function() {
	return this;
})();

try {
	// This works if eval is allowed (see CSP)
	g = g || new Function("return this")();
} catch (e) {
	// This works if the window reference is available
	if (typeof window === "object") g = window;
}

// g can still be undefined, but nothing to do about it...
// We return undefined, instead of nothing here, so it's
// easier to handle this case. if(!global) { ...}

module.exports = g;


/***/ }),

/***/ "./src/$$_lazy_route_resource lazy recursive":
/*!**********************************************************!*\
  !*** ./src/$$_lazy_route_resource lazy namespace object ***!
  \**********************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

var map = {
	"./main/main.module": [
		"./src/app/main/main.module.ts",
		"main-main-module"
	]
};
function webpackAsyncContext(req) {
	if(!__webpack_require__.o(map, req)) {
		return Promise.resolve().then(function() {
			var e = new Error("Cannot find module '" + req + "'");
			e.code = 'MODULE_NOT_FOUND';
			throw e;
		});
	}

	var ids = map[req], id = ids[0];
	return __webpack_require__.e(ids[1]).then(function() {
		return __webpack_require__(id);
	});
}
webpackAsyncContext.keys = function webpackAsyncContextKeys() {
	return Object.keys(map);
};
webpackAsyncContext.id = "./src/$$_lazy_route_resource lazy recursive";
module.exports = webpackAsyncContext;

/***/ }),

/***/ "./src/app/app-routing.module.ts":
/*!***************************************!*\
  !*** ./src/app/app-routing.module.ts ***!
  \***************************************/
/*! exports provided: AppRoutingModule */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "AppRoutingModule", function() { return AppRoutingModule; });
/* harmony import */ var _angular_core__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @angular/core */ "./node_modules/@angular/core/fesm5/core.js");
/* harmony import */ var _angular_router__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @angular/router */ "./node_modules/@angular/router/fesm5/router.js");
/* harmony import */ var _config_app_config__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./config/app.config */ "./src/app/config/app.config.ts");
/* harmony import */ var _core_error404_error_404_component__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./core/error404/error-404.component */ "./src/app/core/error404/error-404.component.ts");
var __decorate = (undefined && undefined.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};




var routes = [
    { path: '', redirectTo: '/', pathMatch: 'full' },
    { path: '', loadChildren: './main/main.module#MainModule' },
    { path: _config_app_config__WEBPACK_IMPORTED_MODULE_2__["AppConfig"].routes.error404, component: _core_error404_error_404_component__WEBPACK_IMPORTED_MODULE_3__["Error404Component"] },
    // otherwise redirect to 404
    { path: '**', redirectTo: '/' + _config_app_config__WEBPACK_IMPORTED_MODULE_2__["AppConfig"].routes.error404 }
];
var AppRoutingModule = /** @class */ (function () {
    function AppRoutingModule() {
    }
    AppRoutingModule = __decorate([
        Object(_angular_core__WEBPACK_IMPORTED_MODULE_0__["NgModule"])({
            imports: [
                _angular_router__WEBPACK_IMPORTED_MODULE_1__["RouterModule"].forRoot(routes)
            ],
            exports: [
                _angular_router__WEBPACK_IMPORTED_MODULE_1__["RouterModule"]
            ]
        })
    ], AppRoutingModule);
    return AppRoutingModule;
}());



/***/ }),

/***/ "./src/app/app.component.ts":
/*!**********************************!*\
  !*** ./src/app/app.component.ts ***!
  \**********************************/
/*! exports provided: AppComponent */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "AppComponent", function() { return AppComponent; });
/* harmony import */ var _angular_core__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @angular/core */ "./node_modules/@angular/core/fesm5/core.js");
/* harmony import */ var _ngx_translate_core__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @ngx-translate/core */ "./node_modules/@ngx-translate/core/esm5/ngx-translate-core.js");
/* harmony import */ var _angular_platform_browser__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! @angular/platform-browser */ "./node_modules/@angular/platform-browser/fesm5/platform-browser.js");
/* harmony import */ var _angular_router__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! @angular/router */ "./node_modules/@angular/router/fesm5/router.js");
/* harmony import */ var _angular_material__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! @angular/material */ "./node_modules/@angular/material/esm5/material.es5.js");
var __decorate = (undefined && undefined.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (undefined && undefined.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};





var AppComponent = /** @class */ (function () {
    function AppComponent(translateService, title, meta, snackBar, router) {
        this.translateService = translateService;
        this.title = title;
        this.meta = meta;
        this.snackBar = snackBar;
        this.router = router;
        this.isOnline = navigator.onLine;
    }
    AppComponent.prototype.ngOnInit = function () {
        var _this = this;
        this.translateService.setDefaultLang('en');
        this.translateService.use('en');
        this.title.setTitle('bip39');
        this.router.events.subscribe(function (event) {
            if (event instanceof _angular_router__WEBPACK_IMPORTED_MODULE_3__["NavigationEnd"]) {
                switch (event.urlAfterRedirects) {
                    case '/':
                        _this.meta.updateTag({
                            name: 'description',
                            content: 'bip39'
                        });
                        break;
                }
            }
        });
        this.checkBrowserFeatures();
    };
    AppComponent.prototype.checkBrowserFeatures = function () {
        var _this = this;
        var supported = true;
        for (var feature in Modernizr) {
            if (Modernizr.hasOwnProperty(feature) &&
                typeof Modernizr[feature] === 'boolean' && Modernizr[feature] === false) {
                supported = false;
                break;
            }
        }
        if (!supported) {
            this.translateService.get(['updateBrowser']).subscribe(function (texts) {
                _this.snackBar.open(texts['updateBrowser'], 'OK');
            });
        }
        return supported;
    };
    AppComponent.ctorParameters = function () { return [
        { type: _ngx_translate_core__WEBPACK_IMPORTED_MODULE_1__["TranslateService"] },
        { type: _angular_platform_browser__WEBPACK_IMPORTED_MODULE_2__["Title"] },
        { type: _angular_platform_browser__WEBPACK_IMPORTED_MODULE_2__["Meta"] },
        { type: _angular_material__WEBPACK_IMPORTED_MODULE_4__["MatSnackBar"] },
        { type: _angular_router__WEBPACK_IMPORTED_MODULE_3__["Router"] }
    ]; };
    AppComponent = __decorate([
        Object(_angular_core__WEBPACK_IMPORTED_MODULE_0__["Component"])({
            selector: 'app-root',
            template: __webpack_require__(/*! raw-loader!./app.component.html */ "./node_modules/raw-loader/index.js!./src/app/app.component.html")
        }),
        __metadata("design:paramtypes", [_ngx_translate_core__WEBPACK_IMPORTED_MODULE_1__["TranslateService"],
            _angular_platform_browser__WEBPACK_IMPORTED_MODULE_2__["Title"],
            _angular_platform_browser__WEBPACK_IMPORTED_MODULE_2__["Meta"],
            _angular_material__WEBPACK_IMPORTED_MODULE_4__["MatSnackBar"],
            _angular_router__WEBPACK_IMPORTED_MODULE_3__["Router"]])
    ], AppComponent);
    return AppComponent;
}());



/***/ }),

/***/ "./src/app/app.module.ts":
/*!*******************************!*\
  !*** ./src/app/app.module.ts ***!
  \*******************************/
/*! exports provided: AppModule */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "AppModule", function() { return AppModule; });
/* harmony import */ var _angular_core__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @angular/core */ "./node_modules/@angular/core/fesm5/core.js");
/* harmony import */ var _angular_platform_browser__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @angular/platform-browser */ "./node_modules/@angular/platform-browser/fesm5/platform-browser.js");
/* harmony import */ var _angular_forms__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! @angular/forms */ "./node_modules/@angular/forms/fesm5/forms.js");
/* harmony import */ var _config_app_config__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./config/app.config */ "./src/app/config/app.config.ts");
/* harmony import */ var _app_routing_module__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ./app-routing.module */ "./src/app/app-routing.module.ts");
/* harmony import */ var _shared_modules_shared_module__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ./shared/modules/shared.module */ "./src/app/shared/modules/shared.module.ts");
/* harmony import */ var _core_core_module__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! ./core/core.module */ "./src/app/core/core.module.ts");
/* harmony import */ var _app_component__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(/*! ./app.component */ "./src/app/app.component.ts");
/* harmony import */ var _angular_platform_browser_animations__WEBPACK_IMPORTED_MODULE_8__ = __webpack_require__(/*! @angular/platform-browser/animations */ "./node_modules/@angular/platform-browser/fesm5/animations.js");
/* harmony import */ var _angular_common_http__WEBPACK_IMPORTED_MODULE_9__ = __webpack_require__(/*! @angular/common/http */ "./node_modules/@angular/common/fesm5/http.js");
/* harmony import */ var _ngx_translate_core__WEBPACK_IMPORTED_MODULE_10__ = __webpack_require__(/*! @ngx-translate/core */ "./node_modules/@ngx-translate/core/esm5/ngx-translate-core.js");
/* harmony import */ var _app_translate_factory__WEBPACK_IMPORTED_MODULE_11__ = __webpack_require__(/*! ./app.translate.factory */ "./src/app/app.translate.factory.ts");
/* harmony import */ var _core_shared_progress_bar_service__WEBPACK_IMPORTED_MODULE_12__ = __webpack_require__(/*! ./core/shared/progress-bar.service */ "./src/app/core/shared/progress-bar.service.ts");
/* harmony import */ var _shared_interceptors_progress_interceptor__WEBPACK_IMPORTED_MODULE_13__ = __webpack_require__(/*! ./shared/interceptors/progress.interceptor */ "./src/app/shared/interceptors/progress.interceptor.ts");
/* harmony import */ var _shared_interceptors_timing_interceptor__WEBPACK_IMPORTED_MODULE_14__ = __webpack_require__(/*! ./shared/interceptors/timing.interceptor */ "./src/app/shared/interceptors/timing.interceptor.ts");
/* harmony import */ var _angular_service_worker__WEBPACK_IMPORTED_MODULE_15__ = __webpack_require__(/*! @angular/service-worker */ "./node_modules/@angular/service-worker/fesm5/service-worker.js");
/* harmony import */ var _environments_environment__WEBPACK_IMPORTED_MODULE_16__ = __webpack_require__(/*! ../environments/environment */ "./src/environments/environment.ts");
var __decorate = (undefined && undefined.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};

















var AppModule = /** @class */ (function () {
    function AppModule() {
    }
    AppModule = __decorate([
        Object(_angular_core__WEBPACK_IMPORTED_MODULE_0__["NgModule"])({
            imports: [
                _angular_platform_browser__WEBPACK_IMPORTED_MODULE_1__["BrowserModule"],
                _angular_service_worker__WEBPACK_IMPORTED_MODULE_15__["ServiceWorkerModule"].register('/ngsw-worker.js', { enabled: _environments_environment__WEBPACK_IMPORTED_MODULE_16__["environment"].production }),
                _angular_platform_browser_animations__WEBPACK_IMPORTED_MODULE_8__["BrowserAnimationsModule"],
                _angular_forms__WEBPACK_IMPORTED_MODULE_2__["FormsModule"],
                _angular_common_http__WEBPACK_IMPORTED_MODULE_9__["HttpClientModule"],
                _ngx_translate_core__WEBPACK_IMPORTED_MODULE_10__["TranslateModule"].forRoot({
                    loader: {
                        provide: _ngx_translate_core__WEBPACK_IMPORTED_MODULE_10__["TranslateLoader"],
                        useFactory: _app_translate_factory__WEBPACK_IMPORTED_MODULE_11__["HttpLoaderFactory"],
                        deps: [_angular_common_http__WEBPACK_IMPORTED_MODULE_9__["HttpClient"]]
                    }
                }),
                _shared_modules_shared_module__WEBPACK_IMPORTED_MODULE_5__["SharedModule"].forRoot(),
                _core_core_module__WEBPACK_IMPORTED_MODULE_6__["CoreModule"],
                _app_routing_module__WEBPACK_IMPORTED_MODULE_4__["AppRoutingModule"]
            ],
            declarations: [
                _app_component__WEBPACK_IMPORTED_MODULE_7__["AppComponent"],
            ],
            providers: [
                { provide: _config_app_config__WEBPACK_IMPORTED_MODULE_3__["APP_CONFIG"], useValue: _config_app_config__WEBPACK_IMPORTED_MODULE_3__["AppConfig"] },
                { provide: _angular_common_http__WEBPACK_IMPORTED_MODULE_9__["HTTP_INTERCEPTORS"], useClass: _shared_interceptors_progress_interceptor__WEBPACK_IMPORTED_MODULE_13__["ProgressInterceptor"], multi: true, deps: [_core_shared_progress_bar_service__WEBPACK_IMPORTED_MODULE_12__["ProgressBarService"]] },
                { provide: _angular_common_http__WEBPACK_IMPORTED_MODULE_9__["HTTP_INTERCEPTORS"], useClass: _shared_interceptors_timing_interceptor__WEBPACK_IMPORTED_MODULE_14__["TimingInterceptor"], multi: true }
            ],
            bootstrap: [_app_component__WEBPACK_IMPORTED_MODULE_7__["AppComponent"]]
        })
    ], AppModule);
    return AppModule;
}());



/***/ }),

/***/ "./src/app/app.translate.factory.ts":
/*!******************************************!*\
  !*** ./src/app/app.translate.factory.ts ***!
  \******************************************/
/*! exports provided: HttpLoaderFactory */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "HttpLoaderFactory", function() { return HttpLoaderFactory; });
/* harmony import */ var _ngx_translate_http_loader__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @ngx-translate/http-loader */ "./node_modules/@ngx-translate/http-loader/esm5/ngx-translate-http-loader.js");

function HttpLoaderFactory(http) {
    return new _ngx_translate_http_loader__WEBPACK_IMPORTED_MODULE_0__["TranslateHttpLoader"](http);
}


/***/ }),

/***/ "./src/app/config/app.config.ts":
/*!**************************************!*\
  !*** ./src/app/config/app.config.ts ***!
  \**************************************/
/*! exports provided: APP_CONFIG, AppConfig */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "APP_CONFIG", function() { return APP_CONFIG; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "AppConfig", function() { return AppConfig; });
/* harmony import */ var _angular_core__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @angular/core */ "./node_modules/@angular/core/fesm5/core.js");

var APP_CONFIG = new _angular_core__WEBPACK_IMPORTED_MODULE_0__["InjectionToken"]('app.config');
var AppConfig = {
    routes: {
        faq: 'faq',
        error404: '404'
    },
    endpoints: {},
    snackBarDuration: 3000,
    repositoryURL: 'https://github.com/theborakompanioni/bip39-ng'
};


/***/ }),

/***/ "./src/app/core/core.module.ts":
/*!*************************************!*\
  !*** ./src/app/core/core.module.ts ***!
  \*************************************/
/*! exports provided: CoreModule */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "CoreModule", function() { return CoreModule; });
/* harmony import */ var _angular_core__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @angular/core */ "./node_modules/@angular/core/fesm5/core.js");
/* harmony import */ var _angular_common__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @angular/common */ "./node_modules/@angular/common/fesm5/common.js");
/* harmony import */ var _angular_forms__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! @angular/forms */ "./node_modules/@angular/forms/fesm5/forms.js");
/* harmony import */ var _module_import_guard__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./module-import-guard */ "./src/app/core/module-import-guard.ts");
/* harmony import */ var _shared_logger_service__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ./shared/logger.service */ "./src/app/core/shared/logger.service.ts");
/* harmony import */ var _nav_nav_component__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ./nav/nav.component */ "./src/app/core/nav/nav.component.ts");
/* harmony import */ var _footer_footer_component__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! ./footer/footer.component */ "./src/app/core/footer/footer.component.ts");
/* harmony import */ var _shared_modules_shared_module__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(/*! ../shared/modules/shared.module */ "./src/app/shared/modules/shared.module.ts");
/* harmony import */ var _angular_router__WEBPACK_IMPORTED_MODULE_8__ = __webpack_require__(/*! @angular/router */ "./node_modules/@angular/router/fesm5/router.js");
/* harmony import */ var _error404_error_404_component__WEBPACK_IMPORTED_MODULE_9__ = __webpack_require__(/*! ./error404/error-404.component */ "./src/app/core/error404/error-404.component.ts");
/* harmony import */ var _shared_progress_bar_service__WEBPACK_IMPORTED_MODULE_10__ = __webpack_require__(/*! ./shared/progress-bar.service */ "./src/app/core/shared/progress-bar.service.ts");
var __decorate = (undefined && undefined.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (undefined && undefined.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (undefined && undefined.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};











var CoreModule = /** @class */ (function () {
    function CoreModule(parentModule) {
        Object(_module_import_guard__WEBPACK_IMPORTED_MODULE_3__["throwIfAlreadyLoaded"])(parentModule, 'CoreModule');
    }
    CoreModule.ctorParameters = function () { return [
        { type: CoreModule, decorators: [{ type: _angular_core__WEBPACK_IMPORTED_MODULE_0__["Optional"] }, { type: _angular_core__WEBPACK_IMPORTED_MODULE_0__["SkipSelf"] }] }
    ]; };
    CoreModule = __decorate([
        Object(_angular_core__WEBPACK_IMPORTED_MODULE_0__["NgModule"])({
            imports: [
                _angular_common__WEBPACK_IMPORTED_MODULE_1__["CommonModule"],
                _angular_forms__WEBPACK_IMPORTED_MODULE_2__["FormsModule"],
                _angular_router__WEBPACK_IMPORTED_MODULE_8__["RouterModule"],
                _shared_modules_shared_module__WEBPACK_IMPORTED_MODULE_7__["SharedModule"],
                _angular_forms__WEBPACK_IMPORTED_MODULE_2__["ReactiveFormsModule"]
            ],
            exports: [
                _nav_nav_component__WEBPACK_IMPORTED_MODULE_5__["NavComponent"],
                _footer_footer_component__WEBPACK_IMPORTED_MODULE_6__["FooterComponent"]
            ],
            declarations: [
                _nav_nav_component__WEBPACK_IMPORTED_MODULE_5__["NavComponent"],
                _footer_footer_component__WEBPACK_IMPORTED_MODULE_6__["FooterComponent"],
                _error404_error_404_component__WEBPACK_IMPORTED_MODULE_9__["Error404Component"]
            ],
            providers: [
                _shared_logger_service__WEBPACK_IMPORTED_MODULE_4__["LoggerService"],
                _shared_progress_bar_service__WEBPACK_IMPORTED_MODULE_10__["ProgressBarService"]
            ]
        }),
        __param(0, Object(_angular_core__WEBPACK_IMPORTED_MODULE_0__["Optional"])()), __param(0, Object(_angular_core__WEBPACK_IMPORTED_MODULE_0__["SkipSelf"])()),
        __metadata("design:paramtypes", [CoreModule])
    ], CoreModule);
    return CoreModule;
}());



/***/ }),

/***/ "./src/app/core/error404/error-404.component.scss":
/*!********************************************************!*\
  !*** ./src/app/core/error404/error-404.component.scss ***!
  \********************************************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = "img {\n  margin-left: auto;\n  margin-right: auto;\n  display: block;\n}\n\n.explanation {\n  margin: 1rem 0;\n  text-align: center;\n  font-size: 1.2rem;\n  font-weight: 300;\n}\n/*# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi9ob21lL3ZvaWQvd29ya3NwYWNlL3RoZWJvcmFrb21wYW5pb25pL2JpcDM5LW5nL3NyYy9hcHAvY29yZS9lcnJvcjQwNC9lcnJvci00MDQuY29tcG9uZW50LnNjc3MiLCIvaG9tZS92b2lkL3dvcmtzcGFjZS90aGVib3Jha29tcGFuaW9uaS9iaXAzOS1uZy9zcmMvc3R5bGVzL19taXhpbnMuc2NzcyIsInNyYy9hcHAvY29yZS9lcnJvcjQwNC9lcnJvci00MDQuY29tcG9uZW50LnNjc3MiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBRUE7RUNnQk0saUJBQUE7RUFDQSxrQkFBQTtFRGZKLGNBQUE7QUVBRjs7QUZHQTtFQUNFLGNBQUE7RUFDQSxrQkFBQTtFQUNBLGlCQUFBO0VBQ0EsZ0JBQUE7QUVBRiIsImZpbGUiOiJzcmMvYXBwL2NvcmUvZXJyb3I0MDQvZXJyb3ItNDA0LmNvbXBvbmVudC5zY3NzIiwic291cmNlc0NvbnRlbnQiOlsiQGltcG9ydCBcIm1peGluc1wiO1xuXG5pbWcge1xuICBAaW5jbHVkZSBwdXNoLS1hdXRvKCk7XG4gIGRpc3BsYXk6IGJsb2NrO1xufVxuXG4uZXhwbGFuYXRpb24ge1xuICBtYXJnaW46IDFyZW0gMDtcbiAgdGV4dC1hbGlnbjogY2VudGVyO1xuICBmb250LXNpemU6IDEuMnJlbTtcbiAgZm9udC13ZWlnaHQ6IDMwMDtcbn0iLCJAaW1wb3J0IFwiY29sb3JzXCI7XG5AaW1wb3J0IFwiZnVuY3Rpb25zXCI7XG5cbkBtaXhpbiBmb250LXNpemUoJHNpemUpIHtcbiAgZm9udC1zaXplOiAkc2l6ZTtcbiAgZm9udC1zaXplOiBjYWxjdWxhdGVSZW0oJHNpemUpO1xufVxuXG5AbWl4aW4gcHVzaC0tYXV0bygkdmVydGljYWxseTogZmFsc2UpIHtcbiAgQGlmICR2ZXJ0aWNhbGx5IHtcbiAgICBtYXJnaW46IHtcbiAgICAgIHRvcDogJHZlcnRpY2FsbHk7XG4gICAgICBib3R0b206ICR2ZXJ0aWNhbGx5O1xuICAgICAgbGVmdDogYXV0bztcbiAgICAgIHJpZ2h0OiBhdXRvO1xuICAgIH1cbiAgfSBAZWxzZSB7XG4gICAgbWFyZ2luOiB7XG4gICAgICBsZWZ0OiBhdXRvO1xuICAgICAgcmlnaHQ6IGF1dG87XG4gICAgfVxuICB9XG59XG5cbkBtaXhpbiBmb250LXJvYm90bygkc2l6ZTogZmFsc2UsICRjb2xvdXI6IGZhbHNlLCAkd2VpZ2h0OiBmYWxzZSwgICRsaDogZmFsc2UpIHtcbiAgZm9udC1mYW1pbHk6ICdSb2JvdG8nLCBIZWx2ZXRpY2EsIEFyaWFsLCBzYW5zLXNlcmlmO1xuICBAaWYgJHNpemUge1xuICAgIGZvbnQtc2l6ZTogJHNpemU7XG4gIH1cbiAgQGlmICRjb2xvdXIge1xuICAgIGNvbG9yOiAkY29sb3VyO1xuICB9XG4gIEBpZiAkd2VpZ2h0IHtcbiAgICBmb250LXdlaWdodDogJHdlaWdodDtcbiAgfVxuICBAaWYgJGxoIHtcbiAgICBsaW5lLWhlaWdodDogJGxoO1xuICB9XG59IiwiaW1nIHtcbiAgbWFyZ2luLWxlZnQ6IGF1dG87XG4gIG1hcmdpbi1yaWdodDogYXV0bztcbiAgZGlzcGxheTogYmxvY2s7XG59XG5cbi5leHBsYW5hdGlvbiB7XG4gIG1hcmdpbjogMXJlbSAwO1xuICB0ZXh0LWFsaWduOiBjZW50ZXI7XG4gIGZvbnQtc2l6ZTogMS4ycmVtO1xuICBmb250LXdlaWdodDogMzAwO1xufSJdfQ== */"

/***/ }),

/***/ "./src/app/core/error404/error-404.component.ts":
/*!******************************************************!*\
  !*** ./src/app/core/error404/error-404.component.ts ***!
  \******************************************************/
/*! exports provided: Error404Component */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "Error404Component", function() { return Error404Component; });
/* harmony import */ var _angular_core__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @angular/core */ "./node_modules/@angular/core/fesm5/core.js");
var __decorate = (undefined && undefined.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (undefined && undefined.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};

var Error404Component = /** @class */ (function () {
    function Error404Component() {
    }
    Error404Component = __decorate([
        Object(_angular_core__WEBPACK_IMPORTED_MODULE_0__["Component"])({
            selector: 'app-error-404',
            template: __webpack_require__(/*! raw-loader!./error-404.component.html */ "./node_modules/raw-loader/index.js!./src/app/core/error404/error-404.component.html"),
            styles: [__webpack_require__(/*! ./error-404.component.scss */ "./src/app/core/error404/error-404.component.scss")]
        }),
        __metadata("design:paramtypes", [])
    ], Error404Component);
    return Error404Component;
}());



/***/ }),

/***/ "./src/app/core/footer/footer.component.scss":
/*!***************************************************!*\
  !*** ./src/app/core/footer/footer.component.scss ***!
  \***************************************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = "footer {\n  padding: 0.5rem 1rem;\n  color: #ffffff;\n  background: #3f51b5;\n  margin-top: 2rem;\n  position: -webkit-sticky;\n  position: sticky;\n  top: 100%;\n}\nfooter img {\n  width: 25%;\n}\n.footer-xs {\n  text-align: center;\n  padding-top: 1rem;\n}\n/*# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi9ob21lL3ZvaWQvd29ya3NwYWNlL3RoZWJvcmFrb21wYW5pb25pL2JpcDM5LW5nL3NyYy9hcHAvY29yZS9mb290ZXIvZm9vdGVyLmNvbXBvbmVudC5zY3NzIiwiL2hvbWUvdm9pZC93b3Jrc3BhY2UvdGhlYm9yYWtvbXBhbmlvbmkvYmlwMzktbmcvc3JjL3N0eWxlcy9fY29sb3JzLnNjc3MiLCJzcmMvYXBwL2NvcmUvZm9vdGVyL2Zvb3Rlci5jb21wb25lbnQuc2NzcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFFQTtFQUNFLG9CQUFBO0VBQ0EsY0NITTtFRElOLG1CQ0hLO0VESUwsZ0JBQUE7RUFDQSx3QkFBQTtFQUFBLGdCQUFBO0VBQ0EsU0FBQTtBRURGO0FGR0U7RUFDRSxVQUFBO0FFREo7QUZLQTtFQUNFLGtCQUFBO0VBQ0EsaUJBQUE7QUVGRiIsImZpbGUiOiJzcmMvYXBwL2NvcmUvZm9vdGVyL2Zvb3Rlci5jb21wb25lbnQuc2NzcyIsInNvdXJjZXNDb250ZW50IjpbIkBpbXBvcnQgXCJtaXhpbnNcIjtcblxuZm9vdGVyIHtcbiAgcGFkZGluZzogY2FsY3VsYXRlUmVtKDhweCkgY2FsY3VsYXRlUmVtKDE2cHgpO1xuICBjb2xvcjogJHNlY29uZGFyeS0tY29sb3I7XG4gIGJhY2tncm91bmQ6ICRwcmltYXJ5LS1jb2xvcjtcbiAgbWFyZ2luLXRvcDogMnJlbTtcbiAgcG9zaXRpb246IHN0aWNreTtcbiAgdG9wOiAxMDAlO1xuXG4gIGltZyB7XG4gICAgd2lkdGg6IDI1JTtcbiAgfVxufVxuXG4uZm9vdGVyLXhzIHtcbiAgdGV4dC1hbGlnbjogY2VudGVyO1xuICBwYWRkaW5nLXRvcDogMXJlbTtcbn1cbiIsIi8vIERlc2NyaXB0aXZlIENvbG9yc1xuJHdoaXRlOiAjZmZmZmZmO1xuJGJsdWU6ICMzZjUxYjU7XG4kcmVkOiAjZGMxNDNjO1xuJGdyZXk6ICNiYmJiYmI7XG4kbGlnaHQtZ3JleTogI2VlZWVlZTtcblxuLy8gRnVuY3Rpb25hbCBDb2xvcnNcbiRwcmltYXJ5LS1jb2xvcjogJGJsdWU7XG4kc2Vjb25kYXJ5LS1jb2xvcjogJHdoaXRlO1xuIiwiZm9vdGVyIHtcbiAgcGFkZGluZzogMC41cmVtIDFyZW07XG4gIGNvbG9yOiAjZmZmZmZmO1xuICBiYWNrZ3JvdW5kOiAjM2Y1MWI1O1xuICBtYXJnaW4tdG9wOiAycmVtO1xuICBwb3NpdGlvbjogc3RpY2t5O1xuICB0b3A6IDEwMCU7XG59XG5mb290ZXIgaW1nIHtcbiAgd2lkdGg6IDI1JTtcbn1cblxuLmZvb3Rlci14cyB7XG4gIHRleHQtYWxpZ246IGNlbnRlcjtcbiAgcGFkZGluZy10b3A6IDFyZW07XG59Il19 */"

/***/ }),

/***/ "./src/app/core/footer/footer.component.ts":
/*!*************************************************!*\
  !*** ./src/app/core/footer/footer.component.ts ***!
  \*************************************************/
/*! exports provided: FooterComponent */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "FooterComponent", function() { return FooterComponent; });
/* harmony import */ var _angular_core__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @angular/core */ "./node_modules/@angular/core/fesm5/core.js");
/* harmony import */ var _ngx_translate_core__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @ngx-translate/core */ "./node_modules/@ngx-translate/core/esm5/ngx-translate-core.js");
var __decorate = (undefined && undefined.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (undefined && undefined.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};


var FooterComponent = /** @class */ (function () {
    function FooterComponent(translateService) {
        this.translateService = translateService;
    }
    FooterComponent.prototype.ngOnInit = function () {
        this.currentLang = this.translateService.currentLang;
    };
    FooterComponent.ctorParameters = function () { return [
        { type: _ngx_translate_core__WEBPACK_IMPORTED_MODULE_1__["TranslateService"] }
    ]; };
    FooterComponent = __decorate([
        Object(_angular_core__WEBPACK_IMPORTED_MODULE_0__["Component"])({
            selector: 'app-footer',
            template: __webpack_require__(/*! raw-loader!./footer.component.html */ "./node_modules/raw-loader/index.js!./src/app/core/footer/footer.component.html"),
            styles: [__webpack_require__(/*! ./footer.component.scss */ "./src/app/core/footer/footer.component.scss")]
        }),
        __metadata("design:paramtypes", [_ngx_translate_core__WEBPACK_IMPORTED_MODULE_1__["TranslateService"]])
    ], FooterComponent);
    return FooterComponent;
}());



/***/ }),

/***/ "./src/app/core/module-import-guard.ts":
/*!*********************************************!*\
  !*** ./src/app/core/module-import-guard.ts ***!
  \*********************************************/
/*! exports provided: throwIfAlreadyLoaded */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "throwIfAlreadyLoaded", function() { return throwIfAlreadyLoaded; });
function throwIfAlreadyLoaded(parentModule, moduleName) {
    if (parentModule) {
        throw new Error(moduleName + " has already been loaded. Import Core modules in the AppModule only.");
    }
}


/***/ }),

/***/ "./src/app/core/nav/nav.component.scss":
/*!*********************************************!*\
  !*** ./src/app/core/nav/nav.component.scss ***!
  \*********************************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = ":host(app-nav) {\n  padding-top: 0;\n  padding-bottom: 6.5rem;\n  display: grid;\n}\n:host(app-nav) header {\n  position: fixed;\n  z-index: 999;\n  width: 100%;\n}\n:host(app-nav) header nav {\n  display: -ms-flexbox;\n  display: flex;\n  -ms-flex-wrap: wrap;\n      flex-wrap: wrap;\n  -ms-flex-align: center;\n      align-items: center;\n  padding: 0.5rem 1rem;\n  color: #ffffff;\n  height: 4rem;\n  background: #3f51b5;\n}\n:host(app-nav) header nav .mat-raised-button {\n  color: #3f51b5;\n  margin-right: 1rem;\n}\n:host(app-nav) header nav .progress-bar {\n  display: -ms-flexbox;\n  display: flex;\n  -ms-flex-line-pack: center;\n      align-content: center;\n  -ms-flex-align: center;\n      align-items: center;\n  height: 0.3125rem;\n}\n:host(app-nav) header nav .icon__image {\n  width: 1.25rem;\n  height: 1.25rem;\n}\n:host(app-nav) header nav img {\n  vertical-align: middle;\n}\n:host(app-nav) header nav #today {\n  font-size: 0.7rem;\n}\n@media (max-width: 807px) {\n  #today {\n    width: 50%;\n  }\n}\n@media (max-width: 680px) {\n  :host(app-nav) {\n    padding-top: 0;\n    padding-bottom: 1rem;\n  }\n  :host(app-nav) header {\n    position: relative;\n  }\n  :host(app-nav) header nav {\n    height: 7rem;\n    display: -ms-flexbox;\n    display: flex;\n    padding: 1rem 2rem 0;\n  }\n  :host(app-nav) header nav > div {\n    margin-top: 1rem;\n  }\n  :host(app-nav) header nav #today {\n    margin-top: 1rem;\n  }\n}\n@media (max-width: 425px) {\n  :host(app-nav) {\n    padding-bottom: 0;\n  }\n  :host(app-nav) header nav app-search-bar {\n    width: 75%;\n  }\n}\n/*# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi9ob21lL3ZvaWQvd29ya3NwYWNlL3RoZWJvcmFrb21wYW5pb25pL2JpcDM5LW5nL3NyYy9hcHAvY29yZS9uYXYvbmF2LmNvbXBvbmVudC5zY3NzIiwic3JjL2FwcC9jb3JlL25hdi9uYXYuY29tcG9uZW50LnNjc3MiLCIvaG9tZS92b2lkL3dvcmtzcGFjZS90aGVib3Jha29tcGFuaW9uaS9iaXAzOS1uZy9zcmMvc3R5bGVzL19jb2xvcnMuc2NzcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFFQTtFQUNFLGNBQUE7RUFDQSxzQkFBQTtFQUNBLGFBQUE7QUNERjtBREdFO0VBQ0UsZUFBQTtFQUNBLFlBQUE7RUFDQSxXQUFBO0FDREo7QURHSTtFQUNFLG9CQUFBO0VBQUEsYUFBQTtFQUNBLG1CQUFBO01BQUEsZUFBQTtFQUNBLHNCQUFBO01BQUEsbUJBQUE7RUFDQSxvQkFBQTtFQUNBLGNFaEJFO0VGaUJGLFlBQUE7RUFDQSxtQkVqQkM7QURnQlA7QURHTTtFQUNFLGNFcEJEO0VGcUJDLGtCQUFBO0FDRFI7QURJTTtFQUNFLG9CQUFBO0VBQUEsYUFBQTtFQUNBLDBCQUFBO01BQUEscUJBQUE7RUFDQSxzQkFBQTtNQUFBLG1CQUFBO0VBQ0EsaUJBQUE7QUNGUjtBREtNO0VBQ0UsY0FBQTtFQUNBLGVBQUE7QUNIUjtBRE1NO0VBQ0Usc0JBQUE7QUNKUjtBRE9NO0VBQ0UsaUJBQUE7QUNMUjtBRFdBO0VBQ0U7SUFDRSxVQUFBO0VDUkY7QUFDRjtBRFdBO0VBQ0U7SUFDRSxjQUFBO0lBQ0Esb0JBQUE7RUNURjtFRFdFO0lBQ0Usa0JBQUE7RUNUSjtFRFdJO0lBQ0UsWUFBQTtJQUNBLG9CQUFBO0lBQUEsYUFBQTtJQUNBLG9CQUFBO0VDVE47RURXTTtJQUNFLGdCQUFBO0VDVFI7RURZTTtJQUNFLGdCQUFBO0VDVlI7QUFDRjtBRGdCQTtFQUNFO0lBQ0UsaUJBQUE7RUNkRjtFRGtCTTtJQUNFLFVBQUE7RUNoQlI7QUFDRiIsImZpbGUiOiJzcmMvYXBwL2NvcmUvbmF2L25hdi5jb21wb25lbnQuc2NzcyIsInNvdXJjZXNDb250ZW50IjpbIkBpbXBvcnQgXCJtaXhpbnNcIjtcblxuOmhvc3QoYXBwLW5hdikge1xuICBwYWRkaW5nLXRvcDogMDtcbiAgcGFkZGluZy1ib3R0b206IDYuNXJlbTtcbiAgZGlzcGxheTogZ3JpZDtcblxuICBoZWFkZXIge1xuICAgIHBvc2l0aW9uOiBmaXhlZDtcbiAgICB6LWluZGV4OiA5OTk7XG4gICAgd2lkdGg6IDEwMCU7XG5cbiAgICBuYXYge1xuICAgICAgZGlzcGxheTogZmxleDtcbiAgICAgIGZsZXgtd3JhcDogd3JhcDtcbiAgICAgIGFsaWduLWl0ZW1zOiBjZW50ZXI7XG4gICAgICBwYWRkaW5nOiBjYWxjdWxhdGVSZW0oOHB4KSBjYWxjdWxhdGVSZW0oMTZweCk7XG4gICAgICBjb2xvcjogJHNlY29uZGFyeS0tY29sb3I7XG4gICAgICBoZWlnaHQ6IDRyZW07XG4gICAgICBiYWNrZ3JvdW5kOiAkcHJpbWFyeS0tY29sb3I7XG5cbiAgICAgIC5tYXQtcmFpc2VkLWJ1dHRvbiB7XG4gICAgICAgIGNvbG9yOiAkcHJpbWFyeS0tY29sb3I7XG4gICAgICAgIG1hcmdpbi1yaWdodDogMXJlbTtcbiAgICAgIH1cblxuICAgICAgLnByb2dyZXNzLWJhciB7XG4gICAgICAgIGRpc3BsYXk6IGZsZXg7XG4gICAgICAgIGFsaWduLWNvbnRlbnQ6IGNlbnRlcjtcbiAgICAgICAgYWxpZ24taXRlbXM6IGNlbnRlcjtcbiAgICAgICAgaGVpZ2h0OiBjYWxjdWxhdGVSZW0oNXB4KTtcbiAgICAgIH1cblxuICAgICAgLmljb25fX2ltYWdlIHtcbiAgICAgICAgd2lkdGg6IGNhbGN1bGF0ZVJlbSgyMHB4KTtcbiAgICAgICAgaGVpZ2h0OiBjYWxjdWxhdGVSZW0oMjBweCk7XG4gICAgICB9XG5cbiAgICAgIGltZyB7XG4gICAgICAgIHZlcnRpY2FsLWFsaWduOiBtaWRkbGU7XG4gICAgICB9XG5cbiAgICAgICN0b2RheSB7XG4gICAgICAgIGZvbnQtc2l6ZTogMC43cmVtO1xuICAgICAgfVxuICAgIH1cbiAgfVxufVxuXG5AbWVkaWEgKG1heC13aWR0aDogODA3cHgpIHtcbiAgI3RvZGF5IHtcbiAgICB3aWR0aDogNTAlO1xuICB9XG59XG5cbkBtZWRpYSAobWF4LXdpZHRoOiA2ODBweCkge1xuICA6aG9zdChhcHAtbmF2KSB7XG4gICAgcGFkZGluZy10b3A6IDA7XG4gICAgcGFkZGluZy1ib3R0b206IDFyZW07XG5cbiAgICBoZWFkZXIge1xuICAgICAgcG9zaXRpb246IHJlbGF0aXZlO1xuXG4gICAgICBuYXYge1xuICAgICAgICBoZWlnaHQ6IDdyZW07XG4gICAgICAgIGRpc3BsYXk6IGZsZXg7XG4gICAgICAgIHBhZGRpbmc6IDFyZW0gMnJlbSAwO1xuXG4gICAgICAgID4gZGl2IHtcbiAgICAgICAgICBtYXJnaW4tdG9wOiAxcmVtO1xuICAgICAgICB9XG5cbiAgICAgICAgI3RvZGF5IHtcbiAgICAgICAgICBtYXJnaW4tdG9wOiAxcmVtO1xuICAgICAgICB9XG4gICAgICB9XG4gICAgfVxuICB9XG59XG5cbkBtZWRpYSAobWF4LXdpZHRoOiA0MjVweCkge1xuICA6aG9zdChhcHAtbmF2KSB7XG4gICAgcGFkZGluZy1ib3R0b206IDA7XG5cbiAgICBoZWFkZXIge1xuICAgICAgbmF2IHtcbiAgICAgICAgYXBwLXNlYXJjaC1iYXIge1xuICAgICAgICAgIHdpZHRoOiA3NSU7XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICB9XG4gIH1cbn1cbiIsIjpob3N0KGFwcC1uYXYpIHtcbiAgcGFkZGluZy10b3A6IDA7XG4gIHBhZGRpbmctYm90dG9tOiA2LjVyZW07XG4gIGRpc3BsYXk6IGdyaWQ7XG59XG46aG9zdChhcHAtbmF2KSBoZWFkZXIge1xuICBwb3NpdGlvbjogZml4ZWQ7XG4gIHotaW5kZXg6IDk5OTtcbiAgd2lkdGg6IDEwMCU7XG59XG46aG9zdChhcHAtbmF2KSBoZWFkZXIgbmF2IHtcbiAgZGlzcGxheTogZmxleDtcbiAgZmxleC13cmFwOiB3cmFwO1xuICBhbGlnbi1pdGVtczogY2VudGVyO1xuICBwYWRkaW5nOiAwLjVyZW0gMXJlbTtcbiAgY29sb3I6ICNmZmZmZmY7XG4gIGhlaWdodDogNHJlbTtcbiAgYmFja2dyb3VuZDogIzNmNTFiNTtcbn1cbjpob3N0KGFwcC1uYXYpIGhlYWRlciBuYXYgLm1hdC1yYWlzZWQtYnV0dG9uIHtcbiAgY29sb3I6ICMzZjUxYjU7XG4gIG1hcmdpbi1yaWdodDogMXJlbTtcbn1cbjpob3N0KGFwcC1uYXYpIGhlYWRlciBuYXYgLnByb2dyZXNzLWJhciB7XG4gIGRpc3BsYXk6IGZsZXg7XG4gIGFsaWduLWNvbnRlbnQ6IGNlbnRlcjtcbiAgYWxpZ24taXRlbXM6IGNlbnRlcjtcbiAgaGVpZ2h0OiAwLjMxMjVyZW07XG59XG46aG9zdChhcHAtbmF2KSBoZWFkZXIgbmF2IC5pY29uX19pbWFnZSB7XG4gIHdpZHRoOiAxLjI1cmVtO1xuICBoZWlnaHQ6IDEuMjVyZW07XG59XG46aG9zdChhcHAtbmF2KSBoZWFkZXIgbmF2IGltZyB7XG4gIHZlcnRpY2FsLWFsaWduOiBtaWRkbGU7XG59XG46aG9zdChhcHAtbmF2KSBoZWFkZXIgbmF2ICN0b2RheSB7XG4gIGZvbnQtc2l6ZTogMC43cmVtO1xufVxuXG5AbWVkaWEgKG1heC13aWR0aDogODA3cHgpIHtcbiAgI3RvZGF5IHtcbiAgICB3aWR0aDogNTAlO1xuICB9XG59XG5AbWVkaWEgKG1heC13aWR0aDogNjgwcHgpIHtcbiAgOmhvc3QoYXBwLW5hdikge1xuICAgIHBhZGRpbmctdG9wOiAwO1xuICAgIHBhZGRpbmctYm90dG9tOiAxcmVtO1xuICB9XG4gIDpob3N0KGFwcC1uYXYpIGhlYWRlciB7XG4gICAgcG9zaXRpb246IHJlbGF0aXZlO1xuICB9XG4gIDpob3N0KGFwcC1uYXYpIGhlYWRlciBuYXYge1xuICAgIGhlaWdodDogN3JlbTtcbiAgICBkaXNwbGF5OiBmbGV4O1xuICAgIHBhZGRpbmc6IDFyZW0gMnJlbSAwO1xuICB9XG4gIDpob3N0KGFwcC1uYXYpIGhlYWRlciBuYXYgPiBkaXYge1xuICAgIG1hcmdpbi10b3A6IDFyZW07XG4gIH1cbiAgOmhvc3QoYXBwLW5hdikgaGVhZGVyIG5hdiAjdG9kYXkge1xuICAgIG1hcmdpbi10b3A6IDFyZW07XG4gIH1cbn1cbkBtZWRpYSAobWF4LXdpZHRoOiA0MjVweCkge1xuICA6aG9zdChhcHAtbmF2KSB7XG4gICAgcGFkZGluZy1ib3R0b206IDA7XG4gIH1cbiAgOmhvc3QoYXBwLW5hdikgaGVhZGVyIG5hdiBhcHAtc2VhcmNoLWJhciB7XG4gICAgd2lkdGg6IDc1JTtcbiAgfVxufSIsIi8vIERlc2NyaXB0aXZlIENvbG9yc1xuJHdoaXRlOiAjZmZmZmZmO1xuJGJsdWU6ICMzZjUxYjU7XG4kcmVkOiAjZGMxNDNjO1xuJGdyZXk6ICNiYmJiYmI7XG4kbGlnaHQtZ3JleTogI2VlZWVlZTtcblxuLy8gRnVuY3Rpb25hbCBDb2xvcnNcbiRwcmltYXJ5LS1jb2xvcjogJGJsdWU7XG4kc2Vjb25kYXJ5LS1jb2xvcjogJHdoaXRlO1xuIl19 */"

/***/ }),

/***/ "./src/app/core/nav/nav.component.ts":
/*!*******************************************!*\
  !*** ./src/app/core/nav/nav.component.ts ***!
  \*******************************************/
/*! exports provided: NavComponent */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "NavComponent", function() { return NavComponent; });
/* harmony import */ var _angular_core__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @angular/core */ "./node_modules/@angular/core/fesm5/core.js");
/* harmony import */ var _ngx_translate_core__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @ngx-translate/core */ "./node_modules/@ngx-translate/core/esm5/ngx-translate-core.js");
/* harmony import */ var _config_app_config__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../../config/app.config */ "./src/app/config/app.config.ts");
/* harmony import */ var _shared_progress_bar_service__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ../shared/progress-bar.service */ "./src/app/core/shared/progress-bar.service.ts");
var __decorate = (undefined && undefined.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (undefined && undefined.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (undefined && undefined.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};




var NavComponent = /** @class */ (function () {
    function NavComponent(appConfig, progressBarService, translateService) {
        this.progressBarService = progressBarService;
        this.translateService = translateService;
        this.menuItems = [];
        this.appConfig = appConfig;
    }
    NavComponent.prototype.ngOnInit = function () {
        var _this = this;
        this.currentLang = this.translateService.currentLang;
        this.loadMenus();
        this.progressBarService.updateProgressBar$.subscribe(function (mode) {
            _this.progressBarMode = mode;
        });
    };
    NavComponent.prototype.changeLanguage = function (language) {
        var _this = this;
        this.translateService.use(language).subscribe(function () {
            _this.loadMenus();
        });
    };
    NavComponent.prototype.loadMenus = function () {
        var _this = this;
        this.translateService.get(['home', 'faq'], {}).subscribe(function (texts) {
            _this.menuItems = [
                { link: '/', name: texts['home'] },
                { link: '/' + _config_app_config__WEBPACK_IMPORTED_MODULE_2__["AppConfig"].routes.faq, name: texts['faq'] }
            ];
        }, function (error) {
            _this.menuItems = [
                { link: '/', name: 'home' },
                { link: '/' + _config_app_config__WEBPACK_IMPORTED_MODULE_2__["AppConfig"].routes.faq, name: 'faq' }
            ];
        }, function () {
            if (_this.menuItems.length === 0) {
                _this.menuItems = [
                    { link: '/', name: 'home' },
                    { link: '/' + _config_app_config__WEBPACK_IMPORTED_MODULE_2__["AppConfig"].routes.faq, name: 'faq' }
                ];
            }
        });
    };
    NavComponent.ctorParameters = function () { return [
        { type: undefined, decorators: [{ type: _angular_core__WEBPACK_IMPORTED_MODULE_0__["Inject"], args: [_config_app_config__WEBPACK_IMPORTED_MODULE_2__["APP_CONFIG"],] }] },
        { type: _shared_progress_bar_service__WEBPACK_IMPORTED_MODULE_3__["ProgressBarService"] },
        { type: _ngx_translate_core__WEBPACK_IMPORTED_MODULE_1__["TranslateService"] }
    ]; };
    NavComponent = __decorate([
        Object(_angular_core__WEBPACK_IMPORTED_MODULE_0__["Component"])({
            selector: 'app-nav',
            template: __webpack_require__(/*! raw-loader!./nav.component.html */ "./node_modules/raw-loader/index.js!./src/app/core/nav/nav.component.html"),
            styles: [__webpack_require__(/*! ./nav.component.scss */ "./src/app/core/nav/nav.component.scss")]
        }),
        __param(0, Object(_angular_core__WEBPACK_IMPORTED_MODULE_0__["Inject"])(_config_app_config__WEBPACK_IMPORTED_MODULE_2__["APP_CONFIG"])),
        __metadata("design:paramtypes", [Object, _shared_progress_bar_service__WEBPACK_IMPORTED_MODULE_3__["ProgressBarService"],
            _ngx_translate_core__WEBPACK_IMPORTED_MODULE_1__["TranslateService"]])
    ], NavComponent);
    return NavComponent;
}());



/***/ }),

/***/ "./src/app/core/shared/logger.service.ts":
/*!***********************************************!*\
  !*** ./src/app/core/shared/logger.service.ts ***!
  \***********************************************/
/*! exports provided: LoggerService */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "LoggerService", function() { return LoggerService; });
/* harmony import */ var _angular_core__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @angular/core */ "./node_modules/@angular/core/fesm5/core.js");
var __decorate = (undefined && undefined.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};

var LoggerService = /** @class */ (function () {
    function LoggerService() {
    }
    LoggerService.log = function (msg) {
        console.log(msg);
    };
    LoggerService.error = function (msg, obj) {
        if (obj === void 0) { obj = {}; }
        console.error(msg, obj);
    };
    LoggerService = __decorate([
        Object(_angular_core__WEBPACK_IMPORTED_MODULE_0__["Injectable"])()
    ], LoggerService);
    return LoggerService;
}());



/***/ }),

/***/ "./src/app/core/shared/progress-bar.service.ts":
/*!*****************************************************!*\
  !*** ./src/app/core/shared/progress-bar.service.ts ***!
  \*****************************************************/
/*! exports provided: ProgressBarService */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "ProgressBarService", function() { return ProgressBarService; });
/* harmony import */ var _angular_core__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @angular/core */ "./node_modules/@angular/core/fesm5/core.js");
var __decorate = (undefined && undefined.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (undefined && undefined.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};

var ProgressBarService = /** @class */ (function () {
    function ProgressBarService() {
        this.requestsRunning = 0;
        this.updateProgressBar$ = new _angular_core__WEBPACK_IMPORTED_MODULE_0__["EventEmitter"]();
    }
    ProgressBarService.prototype.list = function () {
        return this.requestsRunning;
    };
    ProgressBarService.prototype.increase = function () {
        this.requestsRunning++;
        if (this.requestsRunning === 1) {
            this.updateProgressBar$.emit('query');
        }
    };
    ProgressBarService.prototype.decrease = function () {
        if (this.requestsRunning > 0) {
            this.requestsRunning--;
            if (this.requestsRunning === 0) {
                this.updateProgressBar$.emit('none');
            }
        }
    };
    ProgressBarService = __decorate([
        Object(_angular_core__WEBPACK_IMPORTED_MODULE_0__["Injectable"])(),
        __metadata("design:paramtypes", [])
    ], ProgressBarService);
    return ProgressBarService;
}());



/***/ }),

/***/ "./src/app/shared/interceptors/progress.interceptor.ts":
/*!*************************************************************!*\
  !*** ./src/app/shared/interceptors/progress.interceptor.ts ***!
  \*************************************************************/
/*! exports provided: ProgressInterceptor */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "ProgressInterceptor", function() { return ProgressInterceptor; });
/* harmony import */ var rxjs_operators__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! rxjs/operators */ "./node_modules/rxjs/_esm5/operators/index.js");
/* harmony import */ var _angular_common_http__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @angular/common/http */ "./node_modules/@angular/common/fesm5/http.js");
/* harmony import */ var _core_shared_progress_bar_service__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../../core/shared/progress-bar.service */ "./src/app/core/shared/progress-bar.service.ts");



var ProgressInterceptor = /** @class */ (function () {
    function ProgressInterceptor(progressBarService) {
        this.progressBarService = progressBarService;
    }
    ProgressInterceptor.prototype.intercept = function (req, next) {
        var _this = this;
        this.progressBarService.increase();
        return next.handle(req).pipe(Object(rxjs_operators__WEBPACK_IMPORTED_MODULE_0__["tap"])(function (event) {
            if (event instanceof _angular_common_http__WEBPACK_IMPORTED_MODULE_1__["HttpResponse"]) {
                _this.progressBarService.decrease();
            }
        }, function (error) {
            _this.progressBarService.decrease();
        }));
    };
    ProgressInterceptor.ctorParameters = function () { return [
        { type: _core_shared_progress_bar_service__WEBPACK_IMPORTED_MODULE_2__["ProgressBarService"] }
    ]; };
    return ProgressInterceptor;
}());



/***/ }),

/***/ "./src/app/shared/interceptors/timing.interceptor.ts":
/*!***********************************************************!*\
  !*** ./src/app/shared/interceptors/timing.interceptor.ts ***!
  \***********************************************************/
/*! exports provided: TimingInterceptor */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "TimingInterceptor", function() { return TimingInterceptor; });
/* harmony import */ var rxjs_operators__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! rxjs/operators */ "./node_modules/rxjs/_esm5/operators/index.js");
/* harmony import */ var _angular_common_http__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @angular/common/http */ "./node_modules/@angular/common/fesm5/http.js");
/* harmony import */ var _core_shared_logger_service__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../../core/shared/logger.service */ "./src/app/core/shared/logger.service.ts");



var TimingInterceptor = /** @class */ (function () {
    function TimingInterceptor() {
    }
    TimingInterceptor.prototype.intercept = function (req, next) {
        var started = Date.now();
        return next
            .handle(req).pipe(Object(rxjs_operators__WEBPACK_IMPORTED_MODULE_0__["tap"])(function (event) {
            if (event instanceof _angular_common_http__WEBPACK_IMPORTED_MODULE_1__["HttpResponse"]) {
                var elapsed = Date.now() - started;
                _core_shared_logger_service__WEBPACK_IMPORTED_MODULE_2__["LoggerService"].log("Request for " + req.urlWithParams + " took " + elapsed + " ms.");
            }
        }));
    };
    return TimingInterceptor;
}());



/***/ }),

/***/ "./src/app/shared/modules/material.module.ts":
/*!***************************************************!*\
  !*** ./src/app/shared/modules/material.module.ts ***!
  \***************************************************/
/*! exports provided: MaterialModule */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "MaterialModule", function() { return MaterialModule; });
/* harmony import */ var _angular_material__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @angular/material */ "./node_modules/@angular/material/esm5/material.es5.js");
/* harmony import */ var _angular_core__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @angular/core */ "./node_modules/@angular/core/fesm5/core.js");
var __decorate = (undefined && undefined.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};


var MaterialModule = /** @class */ (function () {
    function MaterialModule() {
    }
    MaterialModule = __decorate([
        Object(_angular_core__WEBPACK_IMPORTED_MODULE_1__["NgModule"])({
            imports: [
                _angular_material__WEBPACK_IMPORTED_MODULE_0__["MatButtonModule"],
                _angular_material__WEBPACK_IMPORTED_MODULE_0__["MatMenuModule"],
                _angular_material__WEBPACK_IMPORTED_MODULE_0__["MatIconModule"],
                _angular_material__WEBPACK_IMPORTED_MODULE_0__["MatCardModule"],
                _angular_material__WEBPACK_IMPORTED_MODULE_0__["MatSliderModule"],
                _angular_material__WEBPACK_IMPORTED_MODULE_0__["MatProgressBarModule"],
                _angular_material__WEBPACK_IMPORTED_MODULE_0__["MatAutocompleteModule"],
                _angular_material__WEBPACK_IMPORTED_MODULE_0__["MatInputModule"],
                _angular_material__WEBPACK_IMPORTED_MODULE_0__["MatGridListModule"],
                _angular_material__WEBPACK_IMPORTED_MODULE_0__["MatSnackBarModule"],
                _angular_material__WEBPACK_IMPORTED_MODULE_0__["MatProgressSpinnerModule"],
                _angular_material__WEBPACK_IMPORTED_MODULE_0__["MatTooltipModule"],
                _angular_material__WEBPACK_IMPORTED_MODULE_0__["MatListModule"],
                _angular_material__WEBPACK_IMPORTED_MODULE_0__["MatDialogModule"]
            ],
            exports: [
                _angular_material__WEBPACK_IMPORTED_MODULE_0__["MatButtonModule"],
                _angular_material__WEBPACK_IMPORTED_MODULE_0__["MatMenuModule"],
                _angular_material__WEBPACK_IMPORTED_MODULE_0__["MatIconModule"],
                _angular_material__WEBPACK_IMPORTED_MODULE_0__["MatCardModule"],
                _angular_material__WEBPACK_IMPORTED_MODULE_0__["MatSliderModule"],
                _angular_material__WEBPACK_IMPORTED_MODULE_0__["MatProgressBarModule"],
                _angular_material__WEBPACK_IMPORTED_MODULE_0__["MatAutocompleteModule"],
                _angular_material__WEBPACK_IMPORTED_MODULE_0__["MatInputModule"],
                _angular_material__WEBPACK_IMPORTED_MODULE_0__["MatGridListModule"],
                _angular_material__WEBPACK_IMPORTED_MODULE_0__["MatSnackBarModule"],
                _angular_material__WEBPACK_IMPORTED_MODULE_0__["MatProgressSpinnerModule"],
                _angular_material__WEBPACK_IMPORTED_MODULE_0__["MatTooltipModule"],
                _angular_material__WEBPACK_IMPORTED_MODULE_0__["MatListModule"],
                _angular_material__WEBPACK_IMPORTED_MODULE_0__["MatDialogModule"]
            ],
        })
    ], MaterialModule);
    return MaterialModule;
}());



/***/ }),

/***/ "./src/app/shared/modules/shared.module.ts":
/*!*************************************************!*\
  !*** ./src/app/shared/modules/shared.module.ts ***!
  \*************************************************/
/*! exports provided: SharedModule */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "SharedModule", function() { return SharedModule; });
/* harmony import */ var _angular_core__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @angular/core */ "./node_modules/@angular/core/fesm5/core.js");
/* harmony import */ var _material_module__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./material.module */ "./src/app/shared/modules/material.module.ts");
/* harmony import */ var _ngx_translate_core__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! @ngx-translate/core */ "./node_modules/@ngx-translate/core/esm5/ngx-translate-core.js");
/* harmony import */ var _angular_flex_layout__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! @angular/flex-layout */ "./node_modules/@angular/flex-layout/esm5/flex-layout.es5.js");
var __decorate = (undefined && undefined.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};




var SharedModule = /** @class */ (function () {
    function SharedModule() {
    }
    SharedModule_1 = SharedModule;
    SharedModule.forRoot = function () {
        return {
            ngModule: SharedModule_1,
            providers: []
        };
    };
    var SharedModule_1;
    SharedModule = SharedModule_1 = __decorate([
        Object(_angular_core__WEBPACK_IMPORTED_MODULE_0__["NgModule"])({
            imports: [
                _material_module__WEBPACK_IMPORTED_MODULE_1__["MaterialModule"],
                _angular_flex_layout__WEBPACK_IMPORTED_MODULE_3__["FlexLayoutModule"],
                _ngx_translate_core__WEBPACK_IMPORTED_MODULE_2__["TranslateModule"],
            ],
            exports: [
                _material_module__WEBPACK_IMPORTED_MODULE_1__["MaterialModule"],
                _angular_flex_layout__WEBPACK_IMPORTED_MODULE_3__["FlexLayoutModule"],
                _ngx_translate_core__WEBPACK_IMPORTED_MODULE_2__["TranslateModule"],
            ]
        })
    ], SharedModule);
    return SharedModule;
}());



/***/ }),

/***/ "./src/environments/environment.ts":
/*!*****************************************!*\
  !*** ./src/environments/environment.ts ***!
  \*****************************************/
/*! exports provided: environment */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "environment", function() { return environment; });
var environment = {
    production: false
};


/***/ }),

/***/ "./src/main.ts":
/*!*********************!*\
  !*** ./src/main.ts ***!
  \*********************/
/*! no exports provided */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _angular_core__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @angular/core */ "./node_modules/@angular/core/fesm5/core.js");
/* harmony import */ var _angular_platform_browser_dynamic__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @angular/platform-browser-dynamic */ "./node_modules/@angular/platform-browser-dynamic/fesm5/platform-browser-dynamic.js");
/* harmony import */ var _app_app_module__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./app/app.module */ "./src/app/app.module.ts");
/* harmony import */ var _environments_environment__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./environments/environment */ "./src/environments/environment.ts");




if (_environments_environment__WEBPACK_IMPORTED_MODULE_3__["environment"].production) {
    Object(_angular_core__WEBPACK_IMPORTED_MODULE_0__["enableProdMode"])();
}
Object(_angular_platform_browser_dynamic__WEBPACK_IMPORTED_MODULE_1__["platformBrowserDynamic"])().bootstrapModule(_app_app_module__WEBPACK_IMPORTED_MODULE_2__["AppModule"])
    .catch(function (err) { return console.log(err); });


/***/ }),

/***/ 0:
/*!***************************!*\
  !*** multi ./src/main.ts ***!
  \***************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

module.exports = __webpack_require__(/*! /home/void/workspace/theborakompanioni/bip39-ng/src/main.ts */"./src/main.ts");


/***/ })

},[[0,"runtime","vendor"]]]);
//# sourceMappingURL=main.js.map