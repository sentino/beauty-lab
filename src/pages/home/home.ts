import { Component, ViewChild } from '@angular/core';
import { ConfigProvider } from '../../services/config/config';
import { SharedDataProvider } from '../../services/shared-data/shared-data';
import { trigger, style, animate, transition } from '@angular/animations';
import { ProductsPage } from '../products/products';
import { NavController, Content } from 'ionic-angular';
import { CartContainer } from '../cart/cart-container';
import { SearchPage } from '../search/search';
import { LoadingProvider } from '../../services/loading/loading';
import { App} from 'ionic-angular';
import { Slides } from 'ionic-angular';
import { HttpClient } from '@angular/common/http';
import { GetDataCartAction } from '../../app/store';
import { Store } from '@ngrx/store';
import { ArticlesPromotionsPageContainer } from '../articles-promotions-page/articles-promotions-page-container';

@Component({
  selector: 'page-home',
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
  templateUrl: 'home.html',
})

export class HomePage {
  @ViewChild(Content) content: Content;
  @ViewChild(Slides) slides: Slides;

  banners;
  hits_products;
  last_articles;
  response;
  scrollTopButton = false;
  segments: any = 'topSeller';
  mainInfo;
  healthSubs;
  beautySubs;
  constructor(
    private store: Store<any>,
    public http: HttpClient,
    public config: ConfigProvider,
    public shared: SharedDataProvider,
    public loading: LoadingProvider,
    public appCtrl: App,
    public navCtrl: NavController,
  ) {
    this.healthSubs = this.shared.subCategoriesBeauty;
    this.beautySubs = this.shared.subCategoriesHealth;
  }


  scrollToTop() {
    this.content.scrollToTop(700);
    this.scrollTopButton = false;
  }

  onScroll(e) {
    if (e.scrollTop >= 1200) this.scrollTopButton = true;
    if (e.scrollTop < 1200) this.scrollTopButton = false;
  }

  openProducts(value) {
    this.navCtrl.push(ProductsPage, { sortOrder: value });
  }

  ngAfterContentChecked() {
    this.content.resize();
  }

  getMainInfo() {
    this.http.get(this.config.url + 'pages/index/').subscribe(
      (res: any) => {
        this.mainInfo = res;
        this.banners = this.mainInfo.result.banners;
        this.hits_products = this.mainInfo.result.hits;
        this.last_articles = this.mainInfo.result.articles;

        this.loading.hideSpinner();
      });
  }

  ngOnInit() {
    this.loading.showSpinner();
    this.getMainInfo();
    this.store.dispatch(new GetDataCartAction());
  }

  goToArticles(id) {
    this.navCtrl.setRoot(ArticlesPromotionsPageContainer, { id: id, type: 'articles' })
  }

  openCart() {
      this.navCtrl.push(CartContainer);
  }

  openSearch() {
      this.navCtrl.push(SearchPage);
  }
}
