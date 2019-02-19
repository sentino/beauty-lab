import { createSelector } from '@ngrx/store';
import * as fromReducer from './main.reducer';
import { MemoizedSelector } from '@ngrx/store/src/selector';


export const selectsState = (state) => state.main;
// export const selectLoading = createSelector(selectsState, fromReducer.getLoading);

export const selectCartData = createSelector(selectsState, fromReducer.getCartData);
export const selectCartProducts = createSelector(selectCartData, (cart) => cart.basket);
export const selectCartProductsLength = createSelector(selectCartData, (cart) => {
  if (!cart.basket.length || !cart.basket[0].id || cart.basket[0].id === "") {
    return 0;
  }
  return cart.basket.length;
});
export const selectCartPresents = createSelector(selectCartData, (cart) => cart.gifts);
export const selectCartTotalOldPrice = createSelector(selectCartData, (cart) => cart.summary.sumFullFormat);
export const selectCartTotalNewPrice = createSelector(selectCartData, (cart) => cart.summary.sumFormat);
// export const selectContainsDiscount = createSelector(selectCartData, (cart) => cart.summary.sum > cart.summary.sumFull);


export const selectDataConfirmOrder = createSelector(selectsState, fromReducer.getDataConfirmOrder);
export const selectDataConfirmOrderWarning = createSelector(selectDataConfirmOrder, (confirmOrder) => confirmOrder.messages.warning);
export const selectDataConfirmOrderNotify = createSelector(selectDataConfirmOrder, (confirmOrder) => confirmOrder.messages.notify);
