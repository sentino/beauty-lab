import { Component, OnInit, ViewChild } from '@angular/core';
import { NavController, NavParams, Content } from 'ionic-angular';
import { ConfigProvider } from '../../services/config/config';
import { AlertProvider } from '../../services/alert/alert';
import { LoadingProvider } from '../../services/loading/loading';
import { SharedDataProvider } from '../../services/shared-data/shared-data';
import { trigger, transition, animate, style, state } from '@angular/animations';
import { ProductsPage } from '../products/products';
import { CartContainer } from '../cart/cart-container';
import { HttpClient } from '@angular/common/http';
import { Store } from '@ngrx/store';
import { selectCartProductsLength } from '../../app/store';


@Component({
  selector: 'page-search',
  templateUrl: 'search.html',
  animations: [
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
    ),
    trigger(
      'slideInOut', [
        state('in', style({
          width: '0'
        })),
        state('out', style({
          width: '50%'
        })),
        transition('in => out', animate('300ms ease-in-out')),
        transition('out => in', animate('300ms ease-in-out'))
      ]
    ),
  ],
})

export class SearchPage implements OnInit {
  productsLength$ = this.store.select(selectCartProductsLength);

  @ViewChild(Content) content: Content;
  searchResult = [];
  showCategories = true;
  search_result;
  Products;
  productView = 'grid';
  scrollTopButton = false;
  Sort = false;
  sortListIcon = 'ios-arrow-down';
  background_show;
  sort_path;
  search_string;
  navigation;
  SearchList = false;
  Search_result;
  nav_status =false;
  current_page = 1;
  section_list;
  helpMenuOpen: string;
  pages = [];
  all_pages;

  toggleHelpMenu(): void {
    this.helpMenuOpen = this.helpMenuOpen === 'out' ? 'in' : 'out';
  }
  

  search = {
    "search_string": '',
  };

  sortArray = [
    'Новые', 
    'А - Я', 
    'Я - А', 
    'Цена : от большого - к меньшему', 
    'Цена : от меньшего- к большему', 
  ];
  sortOrder = 'Сортировка';
  all_products;
  query_string;
  empty_status = false;

  constructor(
    private store: Store<any>,
    public navCtrl: NavController,
    public navParams: NavParams,
    public config: ConfigProvider,
    public http: HttpClient,
    public alert: AlertProvider,
    public loading: LoadingProvider,
    public shared: SharedDataProvider,
  ) {
    this.loading.showSpinner();
    this.search_result = navParams.get('result');
    this.search_string = navParams.get('search');

    this.query_string = this.search_result.result.query;

    this.Products = this.search_result.result.products;

    if (this.Products.length == 0){
      this.empty_status = true;
    }
    else{
      this.empty_status = false;
    }

    this.all_pages =  this.search_result.result.navigation.pageAll;

    for(var i = 0 ; i < parseInt(this.all_pages); i++){
      this.pages[i] = ({counter : i+1});
    }
  }
  
  goToPage(next_page) {
    this.current_page = next_page;
    this.loading.showSpinner();
    this.http.get(this.config.url + 'catalog/search/' +'/?q=' + this.query_string + '&page='+ next_page + '&count=20').subscribe((data: any) => {
      this.all_products = data;
      this.Products = this.all_products.result.products;
      this.helpMenuOpen = 'in';
      this.all_pages = this.all_products.result.navigation.pageAll;
      for(var i = 0 ; i < parseInt(this.all_pages); i++){
        this.pages[i] = ({counter : i+1});
      }
      this.loading.hideSpinner();
    },
    err => {
      var er_status = err.status;
    });
  }

  onScroll(e) {
    if (e.scrollTop >= 1200) this.scrollTopButton = true;
    if (e.scrollTop < 1200) this.scrollTopButton = false;
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

  showHideSortsList() {
    if (this.Sort == false) { this.Sort = true; this.sortListIcon = 'ios-arrow-up';}
    else { this.Sort  = false; this.sortListIcon = 'ios-arrow-down'; this.background_show = 'none';}
  }

  changeLayout() {
    if (this.productView == 'list') this.productView = "grid";
    else this.productView = "list";

    this.scrollToTop();
  }

  scrollToTop() {
    this.content.scrollToTop(700);
    this.scrollTopButton = false;
  }

  getSortProducts(value) {
    if (value == 'Новые'){
      value = 'Новые';
      this.sort_path = '&sort=POPULATE';
    }
    
    else if (value == 'А - Я'){
      value = 'а - я ⇵'; 
      this.sort_path = '&sort=NAME&by=ASC';
    } 
    else if (value == 'Я - А'){
      value = 'я - а ⇅';
      this.sort_path ='&sort=NAME&by=DESC';
    } 
    else if (value == 'Цена : от большого - к меньшему'){
      value = 'Цена ⇅';
      this.sort_path = '&sort=PRICE&by=DESC';
    } 
    else if (value == 'Цена : от меньшего- к большему'){
      value = 'Цена ⇵';
      this.sort_path = '&sort=PRICE&by=ASC';
    } 
    else value = value;
    if (value == this.sortOrder) return 0;
    else {
      this.sortOrder = value;
    }
    this.getSortsProducts(this.sort_path);
  }

  getSortsProducts(sort_path) {
    this.http.get(this.config.url + 'catalog/search/?q='+ this.search_string + sort_path).subscribe((data: any) => {
      this.Sort = false;
      this.all_products = data;
      this.Products = data.result.products;

      this.all_pages = this.all_products.result.navigation.pageAll;

      for(var i = 0 ; i < parseInt(this.all_pages); i++){
        this.pages[i] = ({counter : i+1});
      }
    },
    err => {
      var er_status = err.status;
    });
  }

  navHandler() {
    if (this.nav_status == false) { this.nav_status = true; }
    else { this.nav_status = false;}
  }

  openProducts(id, name) {
    this.navCtrl.push(ProductsPage, { id: id, name: name, sortOrder: 'newest' });
  }

  openCart() {
    this.navCtrl.push(CartContainer);
  }

  ngOnInit() {
    this.helpMenuOpen = 'in';
    this.loading.hideSpinner();
  }
}
