// Project Name: IonicEcommerce
// Project URI: http://ionicecommerce.com
// Author: VectorCoder Team
// Author URI: http://vectorcoder.com/
import { Component, ViewChild } from '@angular/core';
import { Http } from '@angular/http';
import { map } from "rxjs/operators";
import { ConfigProvider } from '../../services/config/config';
// import { TranslateService } from '@ngx-translate/core';
import { SharedDataProvider } from '../../services/shared-data/shared-data';
import { trigger, style, animate, transition } from '@angular/animations';
import { ProductsPage } from '../products/products';
import { NavController, Content } from 'ionic-angular';
import { CartContainer } from '../cart/cart-container';
import { SearchPage } from '../search/search';
import {Headers, RequestOptions} from '@angular/http';
import { LoadingProvider } from '../../services/loading/loading';
import { App} from 'ionic-angular';
import { Slides } from 'ionic-angular';
import { HttpClient, HttpHeaders } from '@angular/common/http';
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
  banners;
  hits_products;
  last_articles;
  response;

  @ViewChild(Content) content: Content;
  @ViewChild(Slides) slides: Slides;
  scrollToTop() {
    this.content.scrollToTop(700);
    this.scrollTopButton = false;
  }

  onScroll(e) {

    if (e.scrollTop >= 1200) this.scrollTopButton = true;
    if (e.scrollTop < 1200) this.scrollTopButton = false;
    //else this.scrollTopButton=false;
    //   console.log(e);
  }
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
    // translate: TranslateService
  ) {
      // this.loading.hide();
      
      // console.log(this.shared.subCategoriesBeauty);
      // console.log(this.shared.subCategoriesHealth);

      this.healthSubs = this.shared.subCategoriesBeauty;
      this.beautySubs = this.shared.subCategoriesHealth;

  }
  openProducts(value) {
    this.navCtrl.push(ProductsPage, { sortOrder: value });
  }
  ngAfterContentChecked() {
    this.content.resize();
  }

  getMainInfo(){
    // this.loading.show();
    // const headers = new Headers();
    // headers.append('Authorization-Token',this.shared.customerData.accessToken);
    //
    // const options = new RequestOptions({headers: headers});

    // const httpOptions = {
    //   headers: new HttpHeaders({
    //     'Content-Type': 'application/json',
    //     'Authorization-Token': this.shared.customerData.accessToken
    //   })
    // }
    // const headers = new HttpHeaders().set('Authorization-Token', this.shared.customerData.accessToken);

    this.http.get(this.config.url + 'pages/index/').subscribe(
      (res: any) => {
        // this.loading.hide();
        // console.log("User Profile:");
        // console.log(res);
        this.mainInfo = res;
        
        this.banners = this.mainInfo.result.banners;
        this.hits_products = this.mainInfo.result.hits;
        this.last_articles = this.mainInfo.result.articles;

        // console.log("Banners:");
        // console.log(this.banners);

        // console.log("Hits:");
        // console.log(this.hits_products);

        
        // console.log("Articles:");
        // console.log(this.last_articles);


      // if(this.response.result.error == 0){
      //     console.log("Ошибок нету"); 
      //     alert("Данные успешно изменены");
      //   }
  
      //   if(this.response.result.error == 1){
      //     console.log("Ошибочки"); 
      //     console.log(this.response.result.errorText);
      //     alert(this.response.result.errorText);
      //   }
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
