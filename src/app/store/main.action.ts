import { Action } from '@ngrx/store';


const typeCache: { [label: string]: boolean } = {};
export function type<T>(label: T | ''): T {
  if (typeCache[<string>label]) {
    throw new Error(`Action type "${label}" is not unique`);
  }

  typeCache[<string>label] = true;
  return <T>label
}


const CATEGORY = 'Cart';

export const INIT_DATA_CART = type(`[${CATEGORY}] initialize data cart`);

export const GET_DATA_CART = type(`[${CATEGORY}] get data`);
export const GET_DATA_CART_SUCCESS = type(`[${CATEGORY}] get data success`);
export const GET_DATA_CART_FAIL = type(`[${CATEGORY}] get data fail`);

export const DELETE_PRODUCT = type(`[${CATEGORY}] delete product`);
export const DELETE_PRODUCT_SUCCESS = type(`[${CATEGORY}] delete product success`);
export const DELETE_PRODUCT_FAIL = type(`[${CATEGORY}] delete product fail`);

export const UPDATE_DATA_CART = type(`[${CATEGORY}] update data`);
export const UPDATE_DATA_CART_SUCCESS = type(`[${CATEGORY}] update data success`);
export const UPDATE_DATA_CART_FAIL = type(`[${CATEGORY}] update data fail`);

export const UPDATE_QUANTITY_CART = type(`[${CATEGORY}] update quantity cart`);
export const UPDATE_QUANTITY_CART_SUCCESS = type(`[${CATEGORY}] update quantity cart success`);
export const UPDATE_QUANTITY_CART_FAIL = type(`[${CATEGORY}] update quantity cart fail`);

export const POST_PRODUCT = type(`[${CATEGORY}] post product`);
export const POST_PRODUCT_SUCCESS = type(`[${CATEGORY}] post product success`);
export const POST_PRODUCT_FAIL = type(`[${CATEGORY}] post product fail`);


export class InitDataCart implements Action {
  readonly type = INIT_DATA_CART;
  constructor(public payload?: any) {}
}


export class GetDataCartAction implements Action {
  readonly type = GET_DATA_CART;
  constructor(public payload?: any) {}
}
export class GetDataCartSuccessAction implements Action {
  readonly type = GET_DATA_CART_SUCCESS;
  constructor(public payload?: any) {}
}
export class GetDataCartFailAction implements Action {
  readonly type = GET_DATA_CART_FAIL;
  constructor(public payload?: any) {}
}


export class DeleteProductCartAction implements Action {
  readonly type = DELETE_PRODUCT;
  constructor(public payload?: any) {}
}
export class DeleteProductCartSuccessAction implements Action {
  readonly type = DELETE_PRODUCT_SUCCESS;
  constructor(public payload?: any) {}
}
export class DeleteProductCartFailAction implements Action {
  readonly type = DELETE_PRODUCT_FAIL;
  constructor(public payload?: any) {}
}


export class UpdateDataCartAction implements Action {
  readonly type = UPDATE_DATA_CART;
  constructor(public payload?: any) {}
}
export class UpdateDataCartSuccessAction implements Action {
  readonly type = UPDATE_DATA_CART_SUCCESS;
  constructor(public payload?: any) {}
}
export class UpdateDataCartFailAction implements Action {
  readonly type = UPDATE_DATA_CART_FAIL;
  constructor(public payload?: any) {}
}


export class UpdateQuantityCartAction implements Action {
  readonly type = UPDATE_QUANTITY_CART;
  constructor(public payload?: any) {}
}
export class UpdateQuantityCartSuccessAction implements Action {
  readonly type = UPDATE_QUANTITY_CART_SUCCESS;
  constructor(public payload?: any) {}
}
export class UpdateQuantityCartFailAction implements Action {
  readonly type = UPDATE_QUANTITY_CART_FAIL;
  constructor(public payload?: any) {}
}


export class PostProductCartAction implements Action {
  readonly type = POST_PRODUCT;
  constructor(public payload?: any) {}
}
export class PostProductCartSuccessAction implements Action {
  readonly type = POST_PRODUCT_SUCCESS;
  constructor(public payload?: any) {}
}
export class PostProductCartFailAction implements Action {
  readonly type = POST_PRODUCT_FAIL;
  constructor(public payload?: any) {}
}


export type All =
  InitDataCart |
  GetDataCartAction |
  GetDataCartSuccessAction |
  GetDataCartFailAction |
  DeleteProductCartAction |
  DeleteProductCartSuccessAction |
  DeleteProductCartFailAction |
  UpdateDataCartAction |
  UpdateDataCartSuccessAction |
  UpdateDataCartFailAction |
  UpdateQuantityCartAction |
  UpdateQuantityCartSuccessAction |
  UpdateQuantityCartFailAction |
  PostProductCartAction |
  PostProductCartSuccessAction |
  PostProductCartFailAction;
