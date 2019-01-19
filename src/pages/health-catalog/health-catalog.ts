import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams , ActionSheetController} from 'ionic-angular';
import { SearchPage } from '../../pages/search/search';
import { trigger, style, animate, transition, state } from '@angular/animations';
import { ConfigProvider } from '../../services/config/config';
import { LoadingProvider } from '../../services/loading/loading';
import { Http } from '@angular/http';
import { ViewChild } from '@angular/core';
import { Slides } from 'ionic-angular';
// import { TranslateService } from '@ngx-translate/core';
import { ProductsPage } from '../products/products';

/**
 * Generated class for the HealthCatalogPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

// @IonicPage()
@Component({
  selector: 'page-health-catalog',
  templateUrl: 'health-catalog.html',
  animations: [
    trigger('shakeCart', [
      state('inactive', style({
        animation: 'shake 0.75s'
      })),
      state('active', style({
        //  animation: 'shake 0.75s'
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
    // public translate: TranslateService,
    public actionSheet: ActionSheetController,
    public navCtrl: NavController,
    public config: ConfigProvider,
    public navParams: NavParams,
    public loading: LoadingProvider,
    public http: Http,
    ) { }


  showHideSearchList(){
    console.log("Search status");
    console.log(this.SearchList);
    if (this.SearchList == false) { this.SearchList = true; }
    else { this.SearchList = false;}
  }

  getSearch(){
    this.http.get(this.config.url + 'catalog/search/?q=' + this.search.search_string).map(res => res.json()).subscribe(data => {
      // console.log(data.product_data.length + "   " + this.page);
      console.log("Search answer:");
      console.log(data);

      this.Search_result = data;
        this.navCtrl.push(SearchPage, { result: this.Search_result,search: this.search.search_string });
    },
    err => {
      var er_status = err.status;
      console.log(err);
    });
  }

  getMainInfo(){
    this.loading.show();
    this.http.get(this.config.url + 'catalog/health/').map(res => res.json()).subscribe(
      res => {
        this.loading.hide();
        console.log("Beauty catalog:");
        console.log(res);
        this.mainInfo = res;
        this.last_articles = this.mainInfo.result.articles;
        this.hits_products = this.mainInfo.result.productsLeaders;
        this.new_products = this.mainInfo.result.productsNew;
        this.sections = this.mainInfo.result.sections;
        this.banners = this.mainInfo.result.slider;
        

        console.log("Banners:");
        console.log(this.banners);

        console.log("Hits:");
        console.log(this.hits_products);

        
        console.log("Articles:");
        console.log(this.last_articles);
      });
  }

  openCategoryBy() {
    var buttonArray = [];
    // this.translate.get(this.sections).subscribe((res) => {
      
      console.log("Sort massive");
      console.log(this.sections);
      for (let key of this.sections) {
        buttonArray.push({ text: key.TEXT, handler: () => { this.openCatalog(key.ID) } });
      }

      buttonArray.push(
        {
          text: 'Cancel',
          role: 'cancel',
          handler: () => {
            //console.log('Cancel clicked');
          }
        }
      );

      var actionSheet = this.actionSheet.create({
        buttons: buttonArray
      });
      actionSheet.present();
    // });
  }

  openCatalog(catalog_id){
    this.navCtrl.setRoot(ProductsPage, { id_cat: catalog_id});
  }

  ngOnInit() {
    this.getMainInfo();
  }
}
