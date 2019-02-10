import * as fromAction from './main.action';

export interface ICart {
  basket: IBasket[],
  gifts: IGifts[],
  summary: ISunnary
}
export interface IBasket {
  discountPercent: null,
  id: string;
  image: string;
  measure: string;
  name: string;
  productId: string;
  quantity: number;
  price: number;
  priceFormat: string;
  priceFull: number;
  priceFullFormat: string;
  sum: number;
  sumFormat: string;
  sumFull: number;
  sumFullFormat: string;
  loading: boolean;
}
export interface IGifts {
  id: string;
  image: string;
  name: string;
  productId: string;
  quantity: number;
}
export interface ISunnary {
  sum: number;
  sumFormat: string;
  sumFull: number;
  sumFullFormat: string;
}



export interface State {
  cart: ICart
}

export const initialCart = {
  basket: [
    {
      discountPercent: null,
      id: "",
      image: "",
      measure: "",
      name: "",
      productId: "",
      quantity: null,
      price: null,
      priceFormat: "",
      priceFull: null,
      priceFullFormat: "",
      sum: null,
      sumFormat: "",
      sumFull: null,
      sumFullFormat: "",
      loading: true
    }
  ],
  gifts: [
    {
      id: "",
      image: "",
      name: "",
      productId: "",
      quantity: null,
    }
  ],
  summary: {
    sum: null,
    sumFormat: "",
    sumFull: null,
    sumFullFormat: "",
  }
};


export const initialState: State = {
  cart: initialCart
};

export function reducer(state = initialState, action: fromAction.All): State {
  switch (action.type) {

    case fromAction.GET_DATA_CART: {
      return {
        ...state
      };
    }

    case fromAction.INIT_DATA_CART: {
      return {
        ...state,
        cart: initialCart
      };
    }


    case fromAction.GET_DATA_CART_SUCCESS: {
      return {
        ...state,
        cart: action.payload
      };
    }


    case fromAction.DELETE_PRODUCT: {
      return {
        ...state,
        cart: {
          ...state.cart,
          basket: [...state.cart.basket].map( el => {
            let item = el;
            if (item.id === action.payload) {
              item.loading = true;
            }
            return item;
          })
        }
      };
    }


    case fromAction.DELETE_PRODUCT_SUCCESS: {
      return {
        ...state,
        cart: {
          ...state.cart,
          basket: [...state.cart.basket].filter(el => el.id !== action.payload)
        }
      };
    }

    case fromAction.UPDATE_DATA_CART_SUCCESS: {
      return {
        ...state,
        cart: {
          ...state.cart,
          gifts: [
            ...action.payload.gifts
          ],
          summary: {
            ...action.payload.summary
          }
        }
      }
    }


    default: {
      return state;
    }
  }
}

export const getCartData = (state) => state.cart;
