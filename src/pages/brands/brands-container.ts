import { Component, OnInit } from '@angular/core';
import { BrandsService } from '../../services/brands.service';
import { CartContainer } from '../cart/cart-container';
import { SearchPage } from '../search/search';
import { Store } from '@ngrx/store';
import { NavController } from 'ionic-angular';
import { selectCartProductsLength } from '../../app/store';


@Component({
  selector: 'brands-container',
  template: `
    <ion-header>
      <ion-navbar>
        <button ion-button icon-only menuToggle>
          <ion-icon name="menu"></ion-icon>
        </button>
        
        <ion-title>
          Подтверждение заказа
        </ion-title>

        <ion-buttons end>
          <button ion-button icon-only (click)="openSearch()">
            <ion-icon name="search"></ion-icon>
          </button>
          <button ion-button icon-only class="cart-button" (click)="openCart()">
            <ion-icon name="cart">
              <ion-badge color="secondary">{{(productsLength$ | async) ? (productsLength$ | async) : 0}}</ion-badge>
            </ion-icon>
          </button>
        </ion-buttons>
      </ion-navbar>
    </ion-header>

    <ion-content class="confirm-order">
      <brands-component>
        
      </brands-component>
    </ion-content>

    <ion-footer>
      <footer></footer>
    </ion-footer>
  `,
  providers: [BrandsService]
})

export class BrandsContainer implements OnInit {
  productsLength$ = this.store.select(selectCartProductsLength);

  constructor(
    private store: Store<any>,
    public navCtrl: NavController,
    private brandService: BrandsService
  ) { }


  public ngOnInit(): void {
    this.brandService.getBrands().subscribe(res => {
      console.log(res);
      debugger;
    })
  }

  openCart() {
    this.navCtrl.push(CartContainer);
  }
  openSearch() {
    this.navCtrl.push(SearchPage);
  }
}
