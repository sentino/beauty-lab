

export class CartModel {
  basket = [];
  gifts = [];
  discount = {
    apply: [],
    notFound: ''
  };
  summary: {
    sum: number;
    sumFormat: string;
    sumFull: number;
    sumFullFormat: string;
  };

  constructor(res) {
    const { basket, gifts, discount, summary } = res;


    basket.map(el => {
      const { discountPercent, id, image, measure, name, productId, quantity, price,
        priceFormat, priceFull, priceFullFormat, sum, sumFormat, sumFull, sumFullFormat } = el;

      this.basket.push({ discountPercent, id, image, measure, name, productId, quantity, price,
        priceFormat, priceFull, priceFullFormat, sum, sumFormat, sumFull, sumFullFormat, loading: false })

    });


    gifts.map(el => {
      const { id, image, name, productId, quantity } = el;

      this.gifts.push({ id, image, name, productId, quantity })
    });


    if (discount instanceof Object) {
      if (discount.apply && discount.apply.length) {
        discount.apply.map(el => {
          this.discount.apply.push(el);
        });
      }

      if (discount["not-found"] && discount["not-found"].length) {
        this.discount.notFound = discount["not-found"][discount["not-found"].length - 1];
      }
    }

    this.summary = {
      sum: summary.sum,
      sumFormat: summary.sumFormat,
      sumFull: summary.sumFull,
      sumFullFormat: summary.sumFullFormat,
    };
  }
}


export class UpdateCartModel {
  gifts = [];

  summary: {
    sum: number;
    sumFormat: string;
    sumFull: number;
    sumFullFormat: string;
  };

  constructor(res) {
    const { gifts, summary } = res;

    gifts.map(el => {
      const { id, image, name, productId, quantity } = el;

      this.gifts.push({ id, image, name, productId, quantity })
    });


    this.summary = {
      sum: summary.sum,
      sumFormat: summary.sumFormat,
      sumFull: summary.sumFull,
      sumFullFormat: summary.sumFullFormat,
    };
  }
}
