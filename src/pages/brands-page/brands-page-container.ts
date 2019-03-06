import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { selectCartProductsLength } from '../../app/store';
import { Store } from '@ngrx/store';
import { ActionSheetController, Content, NavController, NavParams } from 'ionic-angular';
import { BrandsService } from '../../services/brands.service';
import { CartContainer } from '../cart/cart-container';
import { SearchPage } from '../search/search';
import { Unsubscriber } from '../../helpers/unsubscriber';
import { debounceTime } from 'rxjs/operators';
import { LoadingProvider } from '../../services/loading/loading';
import { SearchService } from '../../services/search.service';
import { animate, style, transition, trigger } from '@angular/animations';



@Component({
  selector: 'brands-page-container',
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
      <ion-navbar style="box-shadow: none;">
        <button ion-button icon-only menuToggle>
          <ion-icon name="menu"></ion-icon>
        </button>

        <ion-title>
          {{name}}
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

    <div class="c-filter" style="top: 56px;">
      <div class="l-filter__row" style="padding-left: 25px;">
        <div class="l-filter__buttons">
          <button class="c-filter__button" *ngIf="brands && brands.length" (click)="openCategoryBy()">{{name}}</button>
          <button class="c-filter__button" *ngIf="gamme && gamme.length" (click)="openGammeBy()">{{nameGamme}}</button>
        </div>
      </div>
    </div>

    <ion-content>
      <brands-page-component
        *ngIf="products && products.length"
        [name]="name"
        [products]="products"
        [navigation]="navigation"
        (loadMoreProducts)="loadMoreProducts()"
      ></brands-page-component>

      <ion-fab bottom right style="margin-bottom: 36px; margin-right: 16px;">
        <button ion-fab (click)="scrollToTop()">
          <ion-icon name="ios-arrow-up"></ion-icon>
        </button>
      </ion-fab>
    </ion-content>

    <ion-footer>
      <footer></footer>
    </ion-footer>
  `,
  providers: [BrandsService]
})

export class BrandsPageContainer extends Unsubscriber implements OnInit, OnDestroy {
  productsLength$ = this.store.select(selectCartProductsLength);

  @ViewChild(Content) content: Content;

  id;
  brands = [];

  name;
  nameGamme = 'Гамма';
  gamme;
  products: any[];
  navigation;

  searchList = false;

  constructor(
    private store: Store<any>,
    private navCtrl: NavController,
    private brandService: BrandsService,
    private navParams: NavParams,
    private actionSheet: ActionSheetController,
    private loading: LoadingProvider,
    private searchService: SearchService,
  ) {
    super();
  }


  public ngOnInit(): void {
    this.loading.showSpinner();
    this.id = this.navParams.get('id');

    this.wrapToUnsubscribe(this.brandService.getBrands()).subscribe(res => {
      let result = res.result;
      for (const key of Object.keys(result)) {
        for (let i = 0; i < result[key].length; i++) {
          this.brands.push(result[key][i]);
        }
      }
    });

    this.initializeData(this.id);
  }

  getSearch(value){
    this.wrapToUnsubscribe(this.searchService.getSearch(value)).subscribe(res => {
      this.navCtrl.push(SearchPage, { result: res, search: value });
    });
  }

  initializeData(id) {
    this.wrapToUnsubscribe(this.brandService.getBrandById(id)).subscribe(res => {
      this.gamme = res.result.gamme;
      this.name = res.result.name;
      this.products = res.result.products;
      this.navigation = res.result.navigation;

      this.loading.hideSpinner();
    })
  }

  initializeDataForGamme(idGamme, name) {
    this.nameGamme = name;

    this.wrapToUnsubscribe(this.brandService.getBrandForGamme(this.id, idGamme)).subscribe( res => {
      this.gamme = res.result.gamme;
      this.products = res.result.products;
      this.navigation = res.result.navigation;
      this.loading.hideSpinner();
    })
  }

  openCategoryBy() {
    let buttonArray = [];

    for (let key of this.brands) {
      buttonArray.push(
        {
          text: key.name,
          handler: () => {
            this.loading.showSpinner();
            this.initializeData(key.id);
          }
        }
      );
    }

    buttonArray.push(
      {
        text: 'Зыкрыть',
        role: 'cancel',
        handler: () => {
        }
      }
    );

    let actionSheet = this.actionSheet.create({
      buttons: buttonArray
    });
    actionSheet.present();
  }


  openGammeBy() {
    let buttonArray = [];

    for (let key of this.gamme) {
      buttonArray.push(
        {
          text: key.name,
          handler: () => {
            this.loading.showSpinner();
            this.initializeDataForGamme(key.id, key.name);
          }
        }
      );
    }

    buttonArray.push(
      {
        text: 'Зыкрыть',
        role: 'cancel',
        handler: () => {
        }
      }
    );

    let actionSheet = this.actionSheet.create({
      buttons: buttonArray
    });
    actionSheet.present();
  }

  loadMoreProducts() {
    this.wrapToUnsubscribe(this.brandService.getMoreProducts(this.id, this.navigation.pageCurrent + 1))
      .pipe(
        debounceTime(2000)
      )
      .subscribe((res: any) => {
        for (let i = 0; i < res.result.products.length; i++) {
          this.products.push(res.result.products[i]);
        }
        this.navigation = res.result.navigation;
    })
  }

  scrollToTop() {
    this.content.scrollToTop(700);
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
