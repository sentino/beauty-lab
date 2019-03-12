import { Component, OnDestroy, OnInit } from '@angular/core';
import { ArticlesPromotionsService } from '../../services/articles-promotions.service';
import { selectCartProductsLength } from '../../app/store';
import { Store } from '@ngrx/store';
import { NavController, NavParams } from 'ionic-angular';
import { CartContainer } from '../cart/cart-container';
import { SearchPage } from '../search/search';
import { ArticlesPromotionsPageContainer } from '../articles-promotions-page/articles-promotions-page-container';
import { Unsubscriber } from '../../helpers/unsubscriber';
import { LoadingProvider } from '../../services/loading/loading';
import { SearchService } from '../../services/search.service';
import { animate, style, transition, trigger } from '@angular/animations';
import { AnalyticsService } from '../../services/analytics.service';


@Component({
  selector: 'articles-promotions-container',
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

  searchList = false;

  constructor(
    private store: Store<any>,
    private navCtrl: NavController,
    private navParams: NavParams,
    private articlesPromotionsService: ArticlesPromotionsService,
    private loading: LoadingProvider,
    private searchService: SearchService,
    private ga: AnalyticsService,
  ) {
    super();
  }


  public ngOnInit(): void {
    this.loading.showSpinner();
    this.type = this.navParams.get('type');

    if (this.type === 'articles') {
      this.title = 'Статьи';
      this.ga.trackPage('articles');
      this.wrapToUnsubscribe(this.articlesPromotionsService.getArticles()).subscribe(res => {
        this.items = res.result;
        this.loading.hideSpinner();
      });
    } else if (this.type === 'promotions') {
      this.title = 'Акции';
      this.ga.trackPage('promo');
      this.wrapToUnsubscribe(this.articlesPromotionsService.getPromotions()).subscribe(res => {
        this.items = res.result;
        this.loading.hideSpinner();
      });
    }
  }

  getSearch(value){
    this.wrapToUnsubscribe(this.searchService.getSearch(value)).subscribe(res => {
      this.navCtrl.push(SearchPage, { result: res, search: value });
    });
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
