import { Component } from '@angular/core';
import { NavController, NavParams , ActionSheetController} from 'ionic-angular';
import { SearchPage } from '../../pages/search/search';
import { trigger, style, animate, transition, state } from '@angular/animations';
import { ConfigProvider } from '../../services/config/config';
import { LoadingProvider } from '../../services/loading/loading';
import { ViewChild } from '@angular/core';
import { Slides } from 'ionic-angular';
import { ProductsPage } from '../products/products';
import { HttpClient } from '@angular/common/http';
import { CartContainer } from '../cart/cart-container';
import { selectCartProductsLength } from '../../app/store';
import { Store } from '@ngrx/store';
import { ArticlesPromotionsPageContainer } from '../articles-promotions-page/articles-promotions-page-container';
import { AnalyticsService } from '../../services/analytics.service';

@Component({
  selector: 'page-health-catalog',
  templateUrl: 'health-catalog.html',
  animations: [
    trigger('shakeCart', [
      state('inactive', style({
        animation: 'shake 0.75s'
      })),
      transition('inactive => active', animate('100ms ease-in')),
      transition('active => inactive', animate('100ms ease-out'))
    ]),
    trigger(
      'animate', [
        transition(':enter', [
          style({ opacity: 0 }),
          animate('500ms', style({ opacity: 1 }))
        ]),
        transition(':leave', [
          style({ opacity: 1 }),
          animate('500ms', style({ opacity: 0 }))
        ])
      ]
    )
  ],
})
export class HealthCatalogPage {
  productsLength$ = this.store.select(selectCartProductsLength);

  banners;
  sections;
  leaders;
  hits_products;
  new_products;
  mainInfo;
  last_articles;
  SearchList = false;
  Search_result;
  

  search = {
    "search_string": '',
  };



  @ViewChild(Slides) slides: Slides;
  constructor(
    private store: Store<any>,
    public actionSheet: ActionSheetController,
    public navCtrl: NavController,
    public config: ConfigProvider,
    public navParams: NavParams,
    public loading: LoadingProvider,
    public http: HttpClient,
    private ga: AnalyticsService
    ) {
    this.ga.trackPage('healthCatalogPage');
  }


  showHideSearchList() {
    if (this.SearchList == false) { this.SearchList = true; }
    else { this.SearchList = false;}
  }

  getSearch() {
    this.http.get(this.config.url + 'catalog/search/?q=' + this.search.search_string).subscribe(data => {

      this.Search_result = data;
        this.navCtrl.push(SearchPage, { result: this.Search_result,search: this.search.search_string });
    },
    err => {
      var er_status = err.status;
    });
  }

  getMainInfo() {

    this.http.get(this.config.url + 'catalog/health/').subscribe(
      res => {

        this.mainInfo = res;
        this.last_articles = this.mainInfo.result.articles;
        this.hits_products = this.mainInfo.result.productsLeaders;
        this.new_products = this.mainInfo.result.productsNew;
        this.sections = this.mainInfo.result.sections;
        this.banners = this.mainInfo.result.slider;

        this.loading.hideSpinner();
      });
  }

  openCategoryBy() {
    var buttonArray = [];
    for (let key of this.sections) {
      buttonArray.push({ text: key.TEXT, handler: () => { this.openCatalog(key.ID) } });
    }

    buttonArray.push(
      {
        text: 'Cancel',
        role: 'cancel',
        handler: () => {
        }
      }
    );

    var actionSheet = this.actionSheet.create({
      buttons: buttonArray
    });
    actionSheet.present();
  }

  openCatalog(catalog_id){
    this.navCtrl.setRoot(ProductsPage, { id_cat: catalog_id});
  }

  goToArticles(id) {
    this.navCtrl.setRoot(ArticlesPromotionsPageContainer, { id: id, type: 'articles' })
  }

  ngOnInit() {
    this.loading.showSpinner();
    this.getMainInfo();
  }

  openCart() {
    this.navCtrl.push(CartContainer);
  }
}
