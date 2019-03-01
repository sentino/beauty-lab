import { Component, OnDestroy, OnInit } from '@angular/core';
import { Unsubscriber } from '../../helpers/unsubscriber';
import { selectCartProductsLength } from '../../app/store';
import { Store } from '@ngrx/store';
import { NavController, NavParams } from 'ionic-angular';
import { CartContainer } from '../cart/cart-container';
import { SearchPage } from '../search/search';
import { ContentPagesService } from '../../services/content-pages.service';


@Component({
  selector: 'contact-page',
  template: `
    <ion-header>
      <ion-navbar>
        <button ion-button icon-only menuToggle>
          <ion-icon name="menu"></ion-icon>
        </button>

        <ion-title>
          {{title}}
        </ion-title>

        <ion-buttons end>
          <!--<button ion-button icon-only (click)="openSearch()">-->
          <!--<ion-icon name="search"></ion-icon>-->
          <!--</button>-->
          <button ion-button icon-only class="cart-button" (click)="openCart()">
            <ion-icon name="cart">
              <ion-badge color="secondary">{{(productsLength$ | async) ? (productsLength$ | async) : 0}}</ion-badge>
            </ion-icon>
          </button>
        </ion-buttons>
      </ion-navbar>


      <!--<ion-toolbar class="toolbar-secondary">-->
      <!--<form  class="search-form" (ngSubmit)="getSearch()" *ngIf="SearchList" [@animate]>-->
      <!--<ion-item>-->
      <!--<ion-icon name="search"></ion-icon>-->
      <!--<ion-input [(ngModel)]="search.search_string" name="search" placeholder="Поиск..." type="text"></ion-input>-->
      <!--</ion-item>-->
      <!--<ion-icon class="close-icon" name="close" (click)="showHideSearchList()"></ion-icon>-->
      <!--</form>-->
      <!--</ion-toolbar>-->
    </ion-header>

    <ion-content>
      <main
        style="margin-top: 22px; padding-left: 16px; padding-right: 16px;"
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

  constructor(
    private store: Store<any>,
    private navCtrl: NavController,
    private navParams: NavParams,
    private contentPagesService: ContentPagesService
  ) {
    super();
  }

  public ngOnInit(): void {
    let page = this.navParams.get('page');
    
    if (page === 'contacts') {
      this.wrapToUnsubscribe(this.contentPagesService.getContacts()).subscribe(res => {
        this.title = res.result.title;
        this.content = res.result.content;
      });
    } else if (page === 'about') {
      this.wrapToUnsubscribe(this.contentPagesService.getAbout()).subscribe(res => {
        this.title = res.result.title;
        this.content = res.result.content;
      });
    } else if (page === 'license') {
      this.wrapToUnsubscribe(this.contentPagesService.getLicense()).subscribe(res => {
        this.title = res.result.title;
        this.content = res.result.content;
      });
    } else if (page === 'guarantees') {
      this.wrapToUnsubscribe(this.contentPagesService.getGuarantees()).subscribe(res => {
        this.title = res.result.title;
        this.content = res.result.content;
      });
    } else if (page === 'legal-entities') {
      this.wrapToUnsubscribe(this.contentPagesService.getLegalEntities()).subscribe(res => {
        this.title = res.result.title;
        this.content = res.result.content;
      });
    } else if (page === 'privacy-policy') {
      this.wrapToUnsubscribe(this.contentPagesService.getPrivacyPolicy()).subscribe(res => {
        this.title = res.result.title;
        this.content = res.result.content;
      });
    } else if (page === 'agreement') {
      this.wrapToUnsubscribe(this.contentPagesService.getAgreement()).subscribe(res => {
        this.title = res.result.title;
        this.content = res.result.content;
      });
    }
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
