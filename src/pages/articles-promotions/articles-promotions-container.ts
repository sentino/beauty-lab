import { Component, OnDestroy, OnInit } from '@angular/core';
import { ArticlesPromotionsService } from '../../services/articles-promotions.service';
import { selectCartProductsLength } from '../../app/store';
import { Store } from '@ngrx/store';
import { NavController, NavParams } from 'ionic-angular';
import { CartContainer } from '../cart/cart-container';
import { SearchPage } from '../search/search';
import { ArticlesPromotionsPageContainer } from '../articles-promotions-page/articles-promotions-page-container';
import { Unsubscriber } from '../../helpers/unsubscriber';


@Component({
  selector: 'articles-promotions-container',
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
      <articles-promotions-component
        *ngIf="items && items.length"
        [items]="items"
        (goToPage)="goToPage($event)"
      ></articles-promotions-component>
    </ion-content>

    <ion-footer>
      <footer></footer>
    </ion-footer>
  `,
  providers: [ArticlesPromotionsService]
})

export class ArticlesPromotionsContainer extends Unsubscriber implements OnInit, OnDestroy {
  productsLength$ = this.store.select(selectCartProductsLength);

  items;
  type;
  title;

  constructor(
    private store: Store<any>,
    private navCtrl: NavController,
    private navParams: NavParams,
    private articlesPromotionsService: ArticlesPromotionsService
  ) {
    super();
  }


  public ngOnInit(): void {
    this.type = this.navParams.get('type');

    if (this.type === 'articles') {
      this.title = 'Статьи';
      this.wrapToUnsubscribe(this.articlesPromotionsService.getArticles()).subscribe(res => {
        this.items = res.result;
      });
    } else if (this.type === 'promotions') {
      this.title = 'Акции';
      this.wrapToUnsubscribe(this.articlesPromotionsService.getPromotions()).subscribe(res => {
        this.items = res.result;
      });
    }
  }

  goToPage(id) {
    this.navCtrl.push(ArticlesPromotionsPageContainer, { id: id, type: this.type })
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
