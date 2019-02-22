import { Component, OnInit } from '@angular/core';
import { selectCartProductsLength } from '../../app/store';
import { Store } from '@ngrx/store';
import { ActionSheetController, NavController, NavParams } from 'ionic-angular';
import { BrandsService } from '../../services/brands.service';
import { CartContainer } from '../cart/cart-container';
import { SearchPage } from '../search/search';


@Component({
  selector: 'brands-page-container',
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
      <brands-page-component
        [name]="name"
        [nameGamme]="nameGamme"
        [gamme]="gamme"
        [products]="products"
        [navigation]="navigation"
        (changeBrand)="openCategoryBy()"
        (changeGamme)="openGammeBy()"
        (loadMoreProducts)="loadMoreProducts()"
      ></brands-page-component>
    </ion-content>

    <ion-footer>
      <footer></footer>
    </ion-footer>
  `,
  providers: [BrandsService]
})

export class BrandsPageContainer implements OnInit {
  productsLength$ = this.store.select(selectCartProductsLength);

  id;
  brands: any[];

  name;
  nameGamme = 'Гамма';
  gamme;
  products: any[];
  navigation;


  constructor(
    private store: Store<any>,
    private navCtrl: NavController,
    private brandService: BrandsService,
    private navParams: NavParams,
    private actionSheet: ActionSheetController,
  ) { }


  public ngOnInit(): void {
    this.brands = this.navParams.get('brands');
    this.id = this.navParams.get('id');

    this.initializeData(this.id);
  }

  initializeData(id) {
    this.brandService.getBrandById(id).subscribe(res => {
      console.log(res);

      this.gamme = res.result.gamme;
      this.name = res.result.name;
      this.products = res.result.products;
      this.navigation = res.result.navigation;
    })
  }

  initializeDataForGamme(idGamme, name) {
    this.nameGamme = name;

    this.brandService.getBrandForGamme(this.id, idGamme).subscribe( res => {
      console.log(res);

      this.gamme = res.result.gamme;
      this.products = res.result.products;
      this.navigation = res.result.navigation;
    })
  }

  openCategoryBy() {
    let buttonArray = [];

    for (let key of this.brands) {
      buttonArray.push({ text: key.name, handler: () => { this.initializeData(key.id) } });
    }

    buttonArray.push(
      {
        text: 'Зыкрыть',
        role: 'cancel',
        handler: () => {
          //console.log('Cancel clicked');
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
      buttonArray.push({ text: key.name, handler: () => { this.initializeDataForGamme(key.id, key.name) } });
    }

    buttonArray.push(
      {
        text: 'Зыкрыть',
        role: 'cancel',
        handler: () => {
          //console.log('Cancel clicked');
        }
      }
    );

    let actionSheet = this.actionSheet.create({
      buttons: buttonArray
    });
    actionSheet.present();
  }

  loadMoreProducts() {
    this.brandService.getMoreProducts(this.id, this.navigation.pageCurrent + 1)
      .subscribe(res => {
        for (let i = 0; i < res.result.products.length; i++) {
          this.products.push(res.result.products[i]);
        }
        this.navigation = res.result.navigation;
        console.log(this.products);
    })
  }

  openCart() {
    this.navCtrl.push(CartContainer);
  }
  openSearch() {
    this.navCtrl.push(SearchPage);
  }
}
