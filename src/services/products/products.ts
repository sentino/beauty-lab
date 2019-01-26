// Project Name: IonicEcommerce
// Project URI: http://ionicecommerce.com
// Author: VectorCoder Team
// Author URI: http://vectorcoder.com/
import { Injectable } from '@angular/core';
import { Http } from '@angular/http';
import { map } from "rxjs/operators";
import { ConfigProvider } from '../config/config';
import { HttpClient } from '@angular/common/http';

@Injectable()
export class ProductsProvider {
  public tab1;

  constructor(public http: HttpClient, public config: ConfigProvider) {
    
  }

  // getProducts(d) {
  //
  //   var data: { [k: string]: any } = {};
  //
  //   data.customers_id = null;
  //   data.page_number = d.page;
  //   if (d.type != undefined)
  //     data.type = d.type;
  //   data.language_id = this.config.langId;
  //
  //   return new Promise(resolve => {
  //
  //     this.http.post(this.config.url + 'getAllProducts', data).map(res => res.json()).subscribe(data => {
  //
  //       resolve(data.product_data);
  //
  //     });
  //   });
  // };
}
