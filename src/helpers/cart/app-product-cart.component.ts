import { Component, Input, OnDestroy } from '@angular/core';
import { WishListService } from '../../services/wish-list.service';
import { PostProductCartAction } from '../../app/store';
import { Store } from '@ngrx/store';
import { ProductDetailPage } from '../../pages/product-detail/product-detail';
import { NavController } from 'ionic-angular';
import { Unsubscriber } from '../unsubscriber';


@Component({
  selector: 'app-product-cart',
  template: `
    <section [ngSwitch]="type">
      <div class="c-good" *ngSwitchCase="'lg'" style="margin-bottom: 35px !important;">
        <div class="c-good--box" style="z-index: 9;">
          <div class="c-good__label c-good__label--hit" *ngIf="cart.PROPS.HIT && cart.PROPS.HIT === 'Y'">ХИТ</div>
          <div class="c-good__label c-good__label--new" *ngIf="cart.PROPS.NEW && cart.PROPS.NEW === 'Y'">NEW</div>
          <div class="c-good__label c-good__label--min-price" *ngIf="cart.PROPS.MIN_PRICE && cart.PROPS.MIN_PRICE === 'Y'">MIN</div>
        </div>
        <div class="c-good__label c-good__label--discount" style="z-index: 9;" *ngIf="cart.PROPS.DISCOUNT_PERCENT">{{cart.PROPS.DISCOUNT_PERCENT}}%</div>
        <div [ngClass]="cart.IN_BASKET === 'Y' ? 'c-good__picked c-good__picked' : 'c-good__picked c-good__picked--hidden'">
          <span class="c-good__checked-circle"></span>
        </div>
        <img *ngIf="cart.IMAGE" [src]="cart.IMAGE" alt="pills" class="c-good__image" (click)="showProductDetail(cart.ID)">
        <img *ngIf="!cart.IMAGE" src="../../assets/images/завантаження.jpg" alt="pills" class="c-good__image" (click)="showProductDetail(cart.ID)">
        <div class="l-good__info">
          <h2 class="c-good__title">
            {{(cart.NAME.length > 65) ? (cart.NAME | slice:0:65)+'...' : (cart.NAME)}}
          </h2>
          <div class="l-good__row l-good__row--little-margin">
            <span class="c-good__price c-good__price--del" style="height: 12.8px">{{ cart.PRICE !== cart.PRICE_DISCOUNT ? cart.PRICE_FORMAT : ''}}</span>
            <span class="c-good__country" style="height: 12.8px">{{cart.COUNTRY}}</span>
          </div>
          <div class="l-good__row l-good__row--little-margin">
            <span class="c-good__price c-good__price--new">{{cart.PRICE_DISCOUNT_FORMAT}}</span>
            <button 
              [ngClass]="cart.IN_WISHLIST === 'Y' ? 'c-good__favorite c-good__favorite--selected' : 'c-good__favorite'"
              (click)="clickWishList(cart.ID)"
            ></button>
          </div>
          <button class="c-primary-button c-primary-button--narrow" (click)="addProduct(cart.ID)">КУПИТЬ</button>
        </div>
      </div>

      
      <div class="c-good c-good--promo" *ngSwitchCase="'md'" style="margin-bottom: 35px !important;">
        <div class="c-good--box" style="z-index: 9;">
          <div class="c-good__label c-good__label--hit" *ngIf="cart.PROPS.HIT && cart.PROPS.HIT === 'Y'">ХИТ</div>
          <div class="c-good__label c-good__label--new" *ngIf="cart.PROPS.NEW && cart.PROPS.NEW === 'Y'">NEW</div>
          <div class="c-good__label c-good__label--min-price" *ngIf="cart.PROPS.MIN_PRICE && cart.PROPS.MIN_PRICE === 'Y'">MIN</div>
        </div>
        <div class="c-good__label c-good__label--discount" style="z-index: 9;" *ngIf="cart.PROPS.DISCOUNT_PERCENT">{{cart.PROPS.DISCOUNT_PERCENT}}%</div>
        <div [ngClass]="cart.IN_BASKET === 'Y' ? 'c-good__picked c-good__picked' : 'c-good__picked c-good__picked--hidden'">
          <span class="c-good__checked-circle"></span>
        </div>
        <img *ngIf="cart.IMAGE" [src]="cart.IMAGE" alt="pills" class="c-good__image" (click)="showProductDetail(cart.ID)">
        <img *ngIf="!cart.IMAGE" src="../../assets/images/завантаження.jpg" alt="pills" class="c-good__image" (click)="showProductDetail(cart.ID)">
        <div class="l-good__info">
          <h2 class="c-good__title c-good__title--promo">
            {{(cart.NAME.length > 50) ? (cart.NAME | slice:0:50)+'...' : (cart.NAME)}}
          </h2>
          <div class="l-good__row l-good__row--promo">
            <span class="c-good__price c-good__price--del" style="height: 12.8px">{{ cart.PRICE !== cart.PRICE_DISCOUNT ? cart.PRICE_FORMAT : ''}}</span>
            <span class="c-good__country" style="height: 12.8px">{{cart.COUNTRY}}</span>
          </div>
          <div class="l-good__row l-good__row--promo &--little-margin">
            <span class="c-good__price c-good__price--new">{{cart.PRICE_DISCOUNT_FORMAT}}</span>
            <button
              [ngClass]="cart.IN_WISHLIST === 'Y' ? 'c-good__favorite c-good__favorite--selected' : 'c-good__favorite'"
              (click)="clickWishList(cart.ID)"
            ></button>
          </div>
          <button class="c-primary-button c-primary-button--narrow" (click)="addProduct(cart.ID)">КУПИТЬ</button>
        </div>
      </div>

      
      <div class="c-good c-good--horizontal" *ngSwitchCase="'horizontal'" style="margin-bottom: 35px !important;">
        <div class="c-good--box" style="z-index: 9;">
          <div class="c-good__label c-good__label--hit" *ngIf="cart.PROPS.HIT && cart.PROPS.HIT === 'Y'">ХИТ</div>
          <div class="c-good__label c-good__label--new" *ngIf="cart.PROPS.NEW && cart.PROPS.NEW === 'Y'">NEW</div>
          <div class="c-good__label c-good__label--min-price" *ngIf="cart.PROPS.MIN_PRICE && cart.PROPS.MIN_PRICE === 'Y'">MIN</div>
        </div>
        <div class="c-good__label c-good__label--discount" style="z-index: 9;" *ngIf="cart.PROPS.DISCOUNT_PERCENT">{{cart.PROPS.DISCOUNT_PERCENT}}%</div>
        <div [ngClass]="cart.IN_BASKET === 'Y' ? 'c-good__picked c-good__picked' : 'c-good__picked c-good__picked--hidden'">
          <span class="c-good__checked-circle"></span>
        </div>
        <img *ngIf="cart.IMAGE" [src]="cart.IMAGE" alt="pills" class="c-good__image" (click)="showProductDetail(cart.ID)" style="width: 127.08px;">
        <img *ngIf="!cart.IMAGE" src="../../assets/images/завантаження.jpg" alt="pills" class="c-good__image" (click)="showProductDetail(cart.ID)">
        <div class="l-good__info l-good__info--horizontal" style="width: 100%;">
          <h2 class="c-good__title c-good__title--horizontal" style="width: 100%;">
            {{(cart.NAME.length > 65) ? (cart.NAME | slice:0:65)+'...' : (cart.NAME)}}
          </h2>
          <div class="l-good__row l-good__row--horizontal">
            <span class="c-good__price c-good__price--del">{{ cart.PRICE !== cart.PRICE_DISCOUNT ? cart.PRICE_FORMAT : ''}}</span>
            <span class="c-good__country">{{cart.COUNTRY}}</span>
          </div>
          <div class="l-good__row l-good__row--promo &--little-margin">
            <span class="c-good__price c-good__price--new">{{cart.PRICE_DISCOUNT_FORMAT}}</span>
            <button
              [ngClass]="cart.IN_WISHLIST === 'Y' ? 'c-good__favorite c-good__favorite--selected' : 'c-good__favorite'"
              (click)="clickWishList(cart.ID)"
            ></button>
          </div>
          <button class="c-primary-button c-primary-button--narrow" (click)="addProduct(cart.ID)">КУПИТЬ</button>
        </div>
      </div>
    </section>
  `
})

export class AppProductCartComponent extends Unsubscriber implements OnDestroy {
  @Input() type;
  @Input() cart;

  constructor(
    private wishListService: WishListService,
    private store: Store<any>,
    private navCtrl: NavController
  ) {
    super();
  }

  clickWishList(id) {
    if (localStorage.getItem('customerData') && this.cart.IN_WISHLIST === 'N') {
      this.wrapToUnsubscribe(this.wishListService.putItem(id)).subscribe(res => {
        this.cart.IN_WISHLIST = 'Y';
      });
    } else {
      this.wrapToUnsubscribe(this.wishListService.delItem(id)).subscribe(res => {
        this.cart.IN_WISHLIST = 'N';
      });
    }
  }

  addProduct(id) {
    this.store.dispatch(new PostProductCartAction({id: id, quantity: 1}));
    this.cart.IN_BASKET = 'Y';
  }

  showProductDetail(id) {
    this.navCtrl.push(ProductDetailPage, { prod_id: id });
  }

  public ngOnDestroy(): void {
    super.ngOnDestroy();
  }
}
