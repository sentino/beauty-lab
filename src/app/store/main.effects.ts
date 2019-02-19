import { Injectable } from '@angular/core';
import { Actions, Effect } from '@ngrx/effects';
import * as fromAction from './main.action';
import { CartService } from '../../services/cart.service';
import { of } from 'rxjs/observable/of';
import {Observable} from 'rxjs/Rx';
import { map } from 'rxjs/operators';
import { mergeMap } from 'rxjs/operators';
import { catchError } from 'rxjs/operators';
import { CartModel, UpdateCartModel } from './main.model';
import { AlertProvider } from '../../services/alert/alert';
import { GET_DATA_CONFIRM_ORDER } from './main.action';
import { PayPaylerService } from '../../services/pay-payler.service';


@Injectable()
export class MainEffects {

  @Effect()
  public getCartData$ = this.action$
    .ofType(fromAction.GET_DATA_CART)
    .pipe(
      map((arg: fromAction.All) => arg.payload),
      mergeMap(payload => {
        return this.getCartData();
      })
    );

  @Effect()
  public deleteCartProduct$ = this.action$
    .ofType(fromAction.DELETE_PRODUCT)
    .pipe(
      map((arg: fromAction.All) => arg.payload),
      mergeMap(payload => {
        return this.deleteCartProduct(payload);
      }),
      mergeMap(result => {
        return [
          result,
          new fromAction.UpdateDataCartAction()
        ]
      })
    );

  @Effect()
  public updateCartData$ = this.action$
    .ofType(fromAction.UPDATE_DATA_CART)
    .pipe(
      map((arg: fromAction.All) => arg.payload),
      mergeMap(payload => {
        return this.updateCartData();
      })
    );

  @Effect()
  public updateQuantityCart$ = this.action$
    .ofType(fromAction.UPDATE_QUANTITY_CART)
    .pipe(
      map((arg: fromAction.All) => arg.payload),
      mergeMap(({id, quantity}) => {
        return this.updateQuantityCart(id, quantity);
      }),
      mergeMap(result => {
        return [
          result,
          new fromAction.GetDataCartAction()
        ]
      })
    );

  @Effect()
  public postProductCart$ = this.action$
    .ofType(fromAction.POST_PRODUCT)
    .pipe(
      map((arg: fromAction.All) => arg.payload),
      mergeMap(({id, quantity}) => {
        return this.postProductCart(id, quantity);
      }),
      mergeMap(result => {
        return [
          result,
          new fromAction.GetDataCartAction()
        ]
      })
    );



  /////////////////////////////////////////////////
  @Effect()
  public getDataConfirmOrder$ = this.action$
    .ofType(fromAction.GET_DATA_CONFIRM_ORDER)
    .pipe(
      map((arg: fromAction.All) => arg.payload),
      mergeMap(payload => {
        return this.getDataConfirmOrder();
      })
    );


  constructor(
    private action$: Actions,
    private cartService: CartService,
    private payPayler: PayPaylerService,
    private alert: AlertProvider
  ) {}

  private getCartData() {
    return this.cartService.getCart()
      .pipe(
        map(res => {
          return new fromAction.GetDataCartSuccessAction(new CartModel(res.result));
        }),
        catchError(e => {
          return of(new fromAction.GetDataCartFailAction(e));
        })
      )
  };

  private deleteCartProduct(id) {
    return this.cartService.delProduct(id)
      .pipe(
        map(res => {
          return new fromAction.DeleteProductCartSuccessAction(id)
        }),
        catchError(e => {
          return of(new fromAction.DeleteProductCartFailAction(e));
        })
      )
  };

  private updateCartData() {
    return this.cartService.getCart()
      .pipe(
        map(res => {
          if (!res.result.basket.length) {
            return new fromAction.GetDataCartSuccessAction(new CartModel(res.result));
          }

          return new fromAction.UpdateDataCartSuccessAction(new UpdateCartModel(res.result));
        }),
        catchError(e => {
          return of(new fromAction.UpdateDataCartFailAction(e));
        })
      )
  };

  private updateQuantityCart(id, quantity) {
    return this.cartService.putProduct(id, quantity)
      .pipe(
        map(res => {
          return new fromAction.UpdateQuantityCartSuccessAction(res);
        }),
        catchError(e => {
          return of(new fromAction.UpdateQuantityCartFailAction(e));
        })
      )
  };

  private postProductCart(id, quantity) {
    return this.cartService.postProduct(id, quantity)
      .pipe(
        map((res: any) => {
          this.alert.show(res.result.successText);
          return new fromAction.PostProductCartSuccessAction(res);
        }),
        catchError(e => {
          return of(new fromAction.PostProductCartFailAction(e));
        })
      )
  };


  /////////////////////////////////////////////////////////
  private getDataConfirmOrder() {
    return this.payPayler.getData()
      .pipe(
        map((res: any) => {
          return new fromAction.GetDataConfirmOrderSuccessAction(res.result);
        }),
        catchError(e => {
          return of(new fromAction.GetDataConfirmOrderFailAction(e));
        })
      )
  }
}
