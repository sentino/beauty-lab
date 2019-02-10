

export class CartModel {
  basket = [];
  gifts = [];

  summary: {
    sum: number;
    sumFormat: string;
    sumFull: number;
    sumFullFormat: string;
  };

  constructor(res) {
    const { basket, gifts, summary } = res;


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
