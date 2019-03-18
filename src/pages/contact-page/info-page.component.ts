import { Component, OnDestroy, OnInit } from '@angular/core';
import { Unsubscriber } from '../../helpers/unsubscriber';
import { selectCartProductsLength } from '../../app/store';
import { Store } from '@ngrx/store';
import { NavController, NavParams } from 'ionic-angular';
import { CartContainer } from '../cart/cart-container';
import { SearchPage } from '../search/search';
import { ContentPagesService } from '../../services/content-pages.service';
import { LoadingProvider } from '../../services/loading/loading';
import { SearchService } from '../../services/search.service';
import { animate, style, transition, trigger } from '@angular/animations';
import { AnalyticsService } from '../../services/analytics.service';


@Component({
  selector: 'contact-page',
  animations: [
    trigger(
      'animate', [
        transition(':enter', [
          style({ opacity: 0 }),
          animate('500ms', style({ opacity: 1 }))
        ]),
        transition(':leave', [
          style({ opacity: 1 }),
          animate('700ms', style({ opacity: 0 }))
        ])
      ]
    )
  ],
  template: `
    <ion-header>
      <ion-navbar [style.boxShadow]="searchList ? 'none' : ''">
        <button ion-button icon-only menuToggle>
          <ion-icon name="menu"></ion-icon>
        </button>

        <ion-title>
          {{title}}
        </ion-title>

        <ion-buttons end>
          <button ion-button icon-only (click)="searchList = !searchList">
            <ion-icon name="search"></ion-icon>
          </button>
          <button ion-button icon-only class="cart-button" (click)="openCart()">
            <ion-icon name="cart">
              <ion-badge color="secondary">{{(productsLength$ | async) ? (productsLength$ | async) : 0}}</ion-badge>
            </ion-icon>
          </button>
        </ion-buttons>
      </ion-navbar>


      <form  class="search-form" (ngSubmit)="getSearch(search.value)" *ngIf="searchList" [@animate]>
        <ion-item>
          <ion-icon name="search"></ion-icon>
          <ion-input #search name="search" placeholder="Поиск..." type="text"></ion-input>
        </ion-item>
        <ion-icon class="close-icon" name="close" (click)="searchList = !searchList"></ion-icon>
      </form>
    </ion-header>

    <ion-content>
      <main
        style="margin-top: 22px; padding-left: 16px; padding-right: 16px;"
        class="box-href"
        *ngIf="content"
        [innerHTML]="content | sanitizeHtml" [href]
      ></main>
    </ion-content>

    <ion-footer>
      <footer></footer>
    </ion-footer>
  `,
  providers: [ContentPagesService]
})

export class InfoPageComponent extends Unsubscriber implements OnInit, OnDestroy {
  productsLength$ = this.store.select(selectCartProductsLength);

  title;
  content;

  searchList = false;

  constructor(
    private store: Store<any>,
    private navCtrl: NavController,
    private navParams: NavParams,
    private contentPagesService: ContentPagesService,
    private loading: LoadingProvider,
    private searchService: SearchService,
    private ga: AnalyticsService,
  ) {
    super();
  }

  public ngOnInit(): void {
    this.loading.showSpinner();
    let page = this.navParams.get('page');
    
    if (page === 'contacts') {
      this.ga.trackPage('contacts');
      this.wrapToUnsubscribe(this.contentPagesService.getContacts()).subscribe(res => {
        this.title = res.result.title;
        this.content = res.result.content;
        this.loading.hideSpinner();
      });
    } else if (page === 'about') {
      this.ga.trackPage('aboutUs');
      this.wrapToUnsubscribe(this.contentPagesService.getAbout()).subscribe(res => {
        this.title = res.result.title;
        this.content = res.result.content;
        this.loading.hideSpinner();
      });
    } else if (page === 'license') {
      this.ga.trackPage('licence');
      this.wrapToUnsubscribe(this.contentPagesService.getLicense()).subscribe(res => {
        this.title = res.result.title;
        this.content = res.result.content;
        this.loading.hideSpinner();
      });
    } else if (page === 'guarantees') {
      this.ga.trackPage('waranty');
      this.wrapToUnsubscribe(this.contentPagesService.getGuarantees()).subscribe(res => {
        this.title = res.result.title;
        this.content = res.result.content;
        this.loading.hideSpinner();
      });
    } else if (page === 'legal-entities') {
      this.ga.trackPage('corporateClients');
      this.wrapToUnsubscribe(this.contentPagesService.getLegalEntities()).subscribe(res => {
        this.title = res.result.title;
        this.content = res.result.content;
        this.loading.hideSpinner();
      });
    } else if (page === 'privacy-policy') {
      this.ga.trackPage('privacyPolicy');
      this.wrapToUnsubscribe(this.contentPagesService.getPrivacyPolicy()).subscribe(res => {
        this.title = res.result.title;
        this.content = res.result.content;
        this.loading.hideSpinner();
      });
    } else if (page === 'agreement') {
      this.ga.trackPage('termsOfUse');
      this.wrapToUnsubscribe(this.contentPagesService.getAgreement()).subscribe(res => {
        this.title = res.result.title;
        this.content = res.result.content;
        this.loading.hideSpinner();
      });
    }
  }

  getSearch(value){
    this.wrapToUnsubscribe(this.searchService.getSearch(value)).subscribe(res => {
      this.navCtrl.push(SearchPage, { result: res, search: value });
    });
  }

  openCart() {
    this.navCtrl.push(CartContainer);
  }
  openSearch() {
    this.navCtrl.push(SearchPage);
  }

  public ngOnDestroy(): void {
    super.ngOnDestroy();
  }
}
