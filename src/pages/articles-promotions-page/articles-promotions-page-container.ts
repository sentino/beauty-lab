import { Component, OnDestroy, OnInit } from '@angular/core';
import { ArticlesPromotionsService } from '../../services/articles-promotions.service';
import { selectCartProductsLength } from '../../app/store';
import { Store } from '@ngrx/store';
import { NavController, NavParams } from 'ionic-angular';
import { CartContainer } from '../cart/cart-container';
import { SearchPage } from '../search/search';
import { SocialSharing } from '@ionic-native/social-sharing/ngx';
import { Unsubscriber } from '../../helpers/unsubscriber';
import { LoadingProvider } from '../../services/loading/loading';


@Component({
  selector: 'articles-promotions-page-container',
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
      <articles-promotions-page-component
        [type]="type"
        [name]="name"
        [desc]="desc"
        [products]="products"
        (share)="share()"
      ></articles-promotions-page-component>
    </ion-content>

    <ion-footer>
      <footer></footer>
    </ion-footer>
  `,
  providers: [ArticlesPromotionsService]
})

export class ArticlesPromotionsPageContainer extends Unsubscriber implements OnInit, OnDestroy {
  productsLength$ = this.store.select(selectCartProductsLength);

  type;
  id;

  title;
  name;
  desc;
  products;
  image;
  url;

  constructor(
    private store: Store<any>,
    private navCtrl: NavController,
    private navParams: NavParams,
    private articlesPromotionsService: ArticlesPromotionsService,
    private socialSharing: SocialSharing,
    private loading: LoadingProvider,
  ) {
    super();
  }


  public ngOnInit(): void {
    this.loading.showSpinner();
    this.type = this.navParams.get('type');
    this.id = this.navParams.get('id');

    if (this.type === 'articles') {
      this.title = 'Статья';
      this.wrapToUnsubscribe(this.articlesPromotionsService.getArticlesById(this.id)).subscribe(res => {
        // console.log(res);
        this.name = res.result.NAME;
        this.desc = res.result.DESC;
        this.products = res.result.products;
        this.image = res.result.IMAGE;
        this.url = res.result.URL;
        this.loading.hideSpinner();
      });
    } else if (this.type === 'promotions') {
      this.title = 'Акция';
      this.wrapToUnsubscribe(this.articlesPromotionsService.getPromotionsById(this.id)).subscribe(res => {
        // console.log(res);
        this.name = res.result.NAME;
        this.desc = res.result.DESC;
        this.products = res.result.products;
        this.image = res.result.IMAGE;
        this.url = res.result.URL;
        this.loading.hideSpinner();
      });
    }
  }

  share() {
    this.socialSharing.share(
      this.name,
      this.name,
      this.image,
      this.url).then(() => {
      // Success!
    }).catch(() => {
      // Error!
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
