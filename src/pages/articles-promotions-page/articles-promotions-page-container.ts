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
import { SearchService } from '../../services/search.service';
import { animate, style, transition, trigger } from '@angular/animations';


@Component({
  selector: 'articles-promotions-page-container',
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

  searchList = false;

  constructor(
    private store: Store<any>,
    private navCtrl: NavController,
    private navParams: NavParams,
    private articlesPromotionsService: ArticlesPromotionsService,
    private socialSharing: SocialSharing,
    private loading: LoadingProvider,
    private searchService: SearchService,
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
        this.name = res.result.NAME;
        this.desc = res.result.DESC;
        this.products = res.result.products;
        this.image = res.result.IMAGE;
        this.url = res.result.URL;
        this.loading.hideSpinner();
      });
    }
  }

  getSearch(value){
    this.wrapToUnsubscribe(this.searchService.getSearch(value)).subscribe(res => {
      this.navCtrl.push(SearchPage, { result: res, search: value });
    });
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
