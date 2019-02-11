// Project Name: IonicEcommerce
// Project URI: http://ionicecommerce.com
// Author: VectorCoder Team
// Author URI: http://vectorcoder.com/
import { Component, OnInit } from '@angular/core';
import { NavController } from 'ionic-angular';
import { SharedDataProvider } from '../../services/shared-data/shared-data';
import { ConfigProvider } from '../../services/config/config';
import { SubCategories3Page } from '../sub-categories3/sub-categories3';
import { trigger, style, animate, transition } from '@angular/animations';
import { CartContainer } from '../cart/cart-container';
import { SearchPage } from '../search/search';
import { selectCartProductsLength } from '../../app/store';
import { Store } from '@ngrx/store';
import { BonusesService } from '../../services/bonuses.service';
import 'rxjs/add/operator/map';
import { Observable, Subscription } from 'rxjs';



@Component({
  selector: 'page-categories3',
  animations: [
    trigger(
      'animate', [
        transition(':enter', [
          style({ opacity: 0 }),
          animate('500ms', style({ opacity: 1 }))
        ]),
        transition(':leave', [
          style({ opacity: 1 }),
          animate('700ms', style({ opacity: 0 }))
        ])
      ]
    )
  ],
  templateUrl: 'categories3.html',
})
export class Categories3Page implements OnInit {
  productsLength$ = this.store.select(selectCartProductsLength);
  dataPoints$: Observable<any>;
  dataTransacts$: Observable<any>;

  constructor(
    private store: Store<any>,
    public navCtrl: NavController,
    // public shared: SharedDataProvider,
    // public config: ConfigProvider
    private bonusesService: BonusesService
  ) {

  }


  public ngOnInit(): void {
    this.dataPoints$ = this.bonusesService.getBonuses().map(res => res.result.points);
    this.dataTransacts$ = this.bonusesService.getBonuses().map(res => res.result.transacts);
    // blah.subscribe(res => {
    //   console.log(res);
    // })
  }


  // openSubCategories(parent) {
  //   this.navCtrl.push(SubCategories3Page, { 'parent': parent });
  // }
  openCart() {
    this.navCtrl.push(CartContainer);
  }
  openSearch() {
      this.navCtrl.push(SearchPage);
  }

}

