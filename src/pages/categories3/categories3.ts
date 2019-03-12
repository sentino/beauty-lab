import { Component, OnDestroy, OnInit } from '@angular/core';
import { NavController } from 'ionic-angular';
import { trigger, style, animate, transition } from '@angular/animations';
import { CartContainer } from '../cart/cart-container';
import { SearchPage } from '../search/search';
import { selectCartProductsLength } from '../../app/store';
import { Store } from '@ngrx/store';
import { BonusesService } from '../../services/bonuses.service';
import 'rxjs/add/operator/map';
import { LoadingProvider } from '../../services/loading/loading';
import { Unsubscriber } from '../../helpers/unsubscriber';
import { SearchService } from '../../services/search.service';
import { AnalyticsService } from '../../services/analytics.service';



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
export class Categories3Page extends Unsubscriber implements OnInit, OnDestroy {
  productsLength$ = this.store.select(selectCartProductsLength);

  dataPoints;
  dataTransacts;

  searchList = false;

  constructor(
    private store: Store<any>,
    public navCtrl: NavController,
    private loading: LoadingProvider,
    private bonusesService: BonusesService,
    private searchService: SearchService,
    private ga: AnalyticsService
  ) {
    super();

    this.ga.trackPage('bonusHistory');
  }


  public ngOnInit(): void {
    this.loading.showSpinner();
    this.wrapToUnsubscribe(this.bonusesService.getBonuses()).subscribe(res => {
      this.dataPoints = res.result.points;
      this.dataTransacts = res.result.transacts;
      this.loading.hideSpinner();
    });
  }

  getSearch(value){
    this.wrapToUnsubscribe(this.searchService.getSearch(value)).subscribe(res => {
      this.navCtrl.push(SearchPage, { result: res, search: value });
    });
  }

  openCart() {
    this.navCtrl.push(CartContainer);
  }
  openSearch() {
      this.navCtrl.push(SearchPage);
  }

  public ngOnDestroy(): void {
    super.ngOnDestroy();
  }
}

