import { Component, ViewChild } from '@angular/core';
import { NavController, NavParams, InfiniteScroll, Content, ActionSheetController, Slides } from 'ionic-angular';
import { ConfigProvider } from '../../services/config/config';
import { SharedDataProvider } from '../../services/shared-data/shared-data';
import { LoadingProvider } from '../../services/loading/loading';
import { trigger, transition, animate, style,state } from '@angular/animations';
import { CartContainer } from '../cart/cart-container';
import { HttpClient, HttpParams } from '@angular/common/http';
import { selectCartProductsLength } from '../../app/store';
import { Store } from '@ngrx/store';


@Component({
  selector: 'page-products',
  templateUrl: 'products.html',
  animations: [
    trigger(
      'slideInOut', [
        state('in', style({
          width: '0'
        })),
        state('out', style({
          width: '100%'
        })),
        transition('in => out', animate('300ms ease-in-out')),
        transition('out => in', animate('300ms ease-in-out'))
      ]
    ),
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
  ]
})



export class ProductsPage {
  productsLength$ = this.store.select(selectCartProductsLength);


  @ViewChild(Content) content: Content;
  @ViewChild(Slides) slider: Slides;
  @ViewChild(InfiniteScroll) infinite: InfiniteScroll;


  scrollTopButton = false;

  helpMenuOpen: string;
  products = new Array;
  selectedTab = '';
  categoryId = '';
  categoryName = '';
  sortOrder = 'Сортировка';
  sortArray = [
    'Новые',
    'А - Я',
    'Я - А',
    'Цена : от большого - к меньшему',
    'Цена : от меньшего- к большему',
  ];

  formData = {
    "query_string": '',                    // type string / required - email
  };

  search = {
    "search_string": '',
  };

  filter_list;

  page = 0;
  applyFilter = false;
  filters = [];
  selectedFilters = [];
  price = { lower: 0, upper: 500 };
  maxAmount = 500;
  side = "right";
  productView = 'grid';
  cat_id;
  all_products;
  navigation;
  all_subcategories;
  pages = [];
  sort_path;
  all_filters;
  all_filters_brand;
  main_filters = [];
  all_sections;
  current_section;
  activeButton;
  n_minimal;
  n_maximum;
  counter_blocks = 0;
  all_pages_count;
  SearchList = false;
  Filter =  false;
  filterListIcon = 'ios-arrow-down';
  end_game = false;
  Sort = false;
  sortListIcon = 'ios-arrow-down';
  background_show;
  nav_status =false;
  current_page = 1;
  section_list;
  empty_filter;
  empty_status;
  empty_products;

  toggleHelpMenu(): void {
    this.helpMenuOpen = this.helpMenuOpen === 'out' ? 'in' : 'out';
  }

  filterList = {
    "brand": '',
    "gamme":'',
    "deystvie":'',
    "mezh_nep_nazvanie":'',
    "tip_kozhi":'',
    "form_vypusk":'',
    "tip_volos":''
  };



  constructor(
    private store: Store<any>,
    public navCtrl: NavController,
    public navParams: NavParams,
    public config: ConfigProvider,
    public shared: SharedDataProvider,
    public loading: LoadingProvider,
    public http: HttpClient,
    public actionSheet: ActionSheetController
  ) {
    this.activeButton = 1;
    this.search.search_string = null;

    this.cat_id = this.navParams.get('id_cat');

    this.section_list = this.navParams.get('section_list');

    if (shared.dir == "rtl") this.side = "left";

    if (this.navParams.get('id') != undefined) this.selectedTab = this.categoryId = this.navParams.get('id');
    if (this.navParams.get('name') != undefined) this.categoryName = this.navParams.get('name');
    if (this.navParams.get('sortOrder') != undefined) this.sortOrder = this.navParams.get('sortOrder');
  }

  test(filter, brand) {
    if (this.filterList) {
      if (filter.code == "brand") {
        return brand.id == this.filterList.brand;
      } else if (filter.code == "gamme") {
        return brand.id == this.filterList.gamme;
      } else if (filter.code == "deystvie") {
        return brand.id == this.filterList.deystvie;
      } else if (filter.code == "mezh_nep_nazvanie") {
        return brand.id == this.filterList.mezh_nep_nazvanie;
      } else if (filter.code == "tip_volos") {
        return brand.id == this.filterList.tip_volos;
      } else if (filter.code == "tip_kozhi") {
        return brand.id == this.filterList.tip_kozhi;
      } else if (filter.code == "form_vypusk") {
        return brand.id == this.filterList.form_vypusk;
      }
    }
  }

  //============================================================================================
  ngOnInit() {
    this.helpMenuOpen = 'in';
    this.getProducts();
    this.getSubacategories();
  }

  //============================================================================================
  ngOnChanges() {}

  submit() {
    this.Filter = false;
    this.filterListIcon = 'ios-arrow-down';
    this.background_show = 'none';
  }

  openCategoryBy() {
    var buttonArray = [];

    for (let key of this.all_sections) {
      buttonArray.push({ text: key.TEXT, handler: () => { this.changeTab(key) } });
    }

    buttonArray.push(
      {
        text: 'Закрыть',
        role: 'cancel',
        handler: () => {
          this.background_show = 'none';
        }
      }
    );

    var actionSheet = this.actionSheet.create({
      buttons: buttonArray
    });
    actionSheet.present();
  }


  showHideSortsList() {
    if (this.Sort == false) {
      this.Sort = true;
      this.sortListIcon = 'ios-arrow-up';
      this.background_show = 'sort';
      this.Filter = false;
      this.filterListIcon = 'ios-arrow-down';
    }
    else {
      this.Sort  = false;
      this.sortListIcon = 'ios-arrow-down';
      this.background_show = 'none';
    }
  }

  showHideFilterList() {
    if (this.Filter == false) {
      this.Filter = true;

      this.filterListIcon = 'ios-arrow-up';
      this.background_show = 'filter';

      this.Sort = false;

      this.sortListIcon = 'ios-arrow-down';
    }
    else {
      this.Filter = false;
      this.filterListIcon = 'ios-arrow-down';
      this.background_show = 'none';
    }
  }

  filtered(newModel){
    this.http.get(this.config.url + 'catalog/section/' + this.cat_id, {params: this.params()}).subscribe((data: any) => {
        this.all_products = data.result.products;
        this.all_filters = data.result.filters;
        this.cat_id;
        this.all_pages_count = parseInt(data.result.navigation.pageAll);
        this.pages = [];
        for(var i = 0 ; i < parseInt(this.all_pages_count); i++){
          this.pages[i] = ({counter : i+1});
        }

        if (this.all_products.length == 0){
          this.empty_products = true;
        }
        else{
          this.empty_products = false;
        }

        if (this.all_filters.length == 0){
          this.empty_filter = true;
        }
        else{
          this.empty_filter = false;
        }
      },
      err => {
        var er_status = err.status;
      });
  }

  showHideSearchList() {
    this.SearchList = !this.SearchList;
  }

  navHandler() {
    this.nav_status = !this.nav_status;
  }

  getProducts() {
    this.http.get(this.config.url + 'catalog/section/' + this.cat_id ).subscribe((data: any) => {
      this.all_products = data.result.products;
      this.navigation = data.result.navigation;
      this.all_filters = data.result.filters;
      this.all_sections = data.result.sections;

      if(this.all_filters.length == 0){
        this.empty_filter = true;
      } else{
        this.empty_filter = false;
      }

      if(this.all_sections.length == 0){
        this.all_sections = this.section_list;
      }

      this.current_section = data.result.section.name;

      this.all_pages_count = this.navigation.pageAll;

      for(var i = 0 ; i < parseInt(this.navigation.pageAll); i++){
        this.pages[i] = ({counter : i+1});
      }

    },
    err => {
      var er_status = err.status;
    });

  }

  getSearch() {
    this.helpMenuOpen = 'in';

    this.http.get(this.config.url + 'catalog/search/?q=' + this.search.search_string).subscribe((data: any) => {
      this.SearchList = false;
      this.current_section = 'Результаты поиска';
      this.all_products = data.result.products;
      this.all_filters = data.result.filters;

      if(this.all_products.length == 0){
        this.empty_status = true;
      } else{
        this.empty_status = false;
      }

      if(this.all_filters == null){
        this.empty_filter = true;
      } else{
        this.empty_filter = false;
      }

      this.all_pages_count = parseInt(data.result.navigation.pageAll);
      this.pages = [];
      for(var i = 0 ; i < parseInt(this.all_pages_count); i++){
        this.pages[i] = ({counter : i+1});
      }
    },
    err => {
      var er_status = err.status;
    });
  }

  getSubacategories() {
    this.http.get(this.config.url + 'catalog/sections/' + this.cat_id ).subscribe((data: any) => {
      this.all_subcategories = data.result.products;
    },
    err => {
      var er_status = err.status;
    });
  }

  goToPage(next_page){
    this.current_page = next_page;

    if( this.search.search_string != null){
      this.current_page = next_page;
      this.helpMenuOpen = 'in';

      this.http.get(this.config.url + 'catalog/search/' +'/?q=' + this.search.search_string + '&page='+ next_page + '&count=20').subscribe((data: any) => {
        this.all_products = data;
        this.all_products = data.result.products;
        this.all_pages_count = data.result.navigation.pageAll;

        this.pages = [];

        for(var i = 0 ; i < parseInt(this.all_pages_count); i++){
          this.pages[i] = ({counter : i+1});
        }
      },
      err => {
        var er_status = err.status;
      });
    } else {
      this.helpMenuOpen = 'in';
      this.http.get(this.config.url + 'catalog/section/' + this.cat_id +'/?page='+ next_page, {params: this.params()}).subscribe((data: any) => {
        this.all_products = data.result.products;
        this.navigation = data.result.navigation;

        this.all_pages_count = data.result.navigation.pageAll;

        this.pages = [];

        for(var i = 0 ; i < parseInt(this.all_pages_count); i++){
          this.pages[i] = ({counter : i+1});
        }
      },
      err => {
        var er_status = err.status;
      });
    }


  }

  showPages() {
    this.end_game = false;
    if(this.n_maximum < this.all_pages_count){
      this.n_maximum+=6;
      for(this.counter_blocks = 0; this.counter_blocks < 6; this.counter_blocks++){
        this.pages[this.counter_blocks] = ({counter : this.counter_blocks+this.n_maximum});
      }
    }
  }

  prevPages() {
    if(this.n_maximum > 0){
      this.n_maximum-=6;
      for(this.counter_blocks = 0; this.counter_blocks < 6; this.counter_blocks++){
        this.pages[this.counter_blocks] = ({counter : this.counter_blocks + 1+this.n_maximum});
      }
    }
  }

  nextPages() {
    this.pages = [];
    if(this.n_maximum < this.all_pages_count){
      for(this.counter_blocks = 0; this.counter_blocks < 6; this.counter_blocks++){
        if(this.counter_blocks+this.n_maximum >  this.all_pages_count){
           this.end_game = true;
           this.n_maximum-=6;
           break;
        } else{
          this.pages[this.counter_blocks] = ({counter : this.counter_blocks+this.n_maximum});
        }
      }
      this.n_maximum+=6;
  } else {
    this.n_maximum-=6;
    for(this.counter_blocks = 0; this.counter_blocks < 6; this.counter_blocks++){
      if(this.counter_blocks+this.n_maximum >  this.all_pages_count){
         break;
      }
      else{
        this.pages[this.counter_blocks] = ({counter : this.counter_blocks+this.n_maximum});
      }
    }
  }
}

  openCatalog(ID,sections){
    this.navCtrl.setRoot(ProductsPage, { id_cat: ID,section_list: sections});
  }

  //changing tab
  changeTab(c) {
    this.activeButton = 1;
    this.applyFilter = false;
    this.page = 0;

    if (c == '') {
      this.getProducts();
      this.selectedTab = c;
    } else {
      this.selectedTab = c.ID;
    }

    this.openCatalog(c.ID,this.all_sections);
  }

  // filling filter array for keyword search
  fillFilterArray = function (fValue, fName, keyword) {
    if (fValue._value == true) {
      this.selectedFilters.push({ 'name': fName, 'value': keyword });
    }
    else {
      this.selectedFilters.forEach((value, index) => {
        if (value.value == keyword) {
          this.selectedFilters.splice(index, 1);
        }
      });
    }
  };

  applyFilters() {
    this.applyFilter = true;
    this.infinite.enable(true);
    this.page = 0;
  }

  resetFilters() {
    this.Filter = false;
    this.getProducts();
  }

  removeFilters() {
    this.applyFilter = false;
    this.infinite.enable(true);
    this.page = 0;

  }

  getSortProducts(value) {
    if (value == 'Новые'){
      value = 'Новые';
      this.sort_path = '?sort=POPULATE';
    }

    else if (value == 'А - Я'){
      value = 'а - я ⇵';
      this.sort_path = '?sort=NAME&by=ASC';
    }
    else if (value == 'Я - А'){
      value = 'я - а ⇅';
      this.sort_path ='?sort=NAME&by=DESC';
    }
    else if (value == 'Цена : от большого - к меньшему'){
      value = 'Цена ⇅';
      this.sort_path = '?sort=PRICE&by=DESC';
    }
    else if (value == 'Цена : от меньшего- к большему'){
      value = 'Цена ⇵';
      this.sort_path = '?sort=PRICE&by=ASC';
    }
    else value = value;
    if (value == this.sortOrder) return 0;
    else {
      this.sortOrder = value;
    }

    this.getSortsProducts(this.sort_path);

}

  getSortsProducts(sort_path) {
    this.http.get(this.config.url + 'catalog/section/' + this.cat_id + sort_path).subscribe((data: any) => {
      this.Sort = false;
      this.all_products = data.result.products;
      this.navigation = data.result.navigation;

      for(var i = 0 ; i < parseInt(this.navigation.pageAll); i++){
        this.pages[i] = ({counter : i+1});
      }
    },
    err => {
      var er_status = err.status;
    });
  }

  openSortBy() {
    var buttonArray = [];
    for (let key in this.sortArray) {
      buttonArray.push({ text: this.sortArray[key], handler: () => { this.getSortProducts(key) } });
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

  changeLayout() {
    if (this.productView == 'list') this.productView = "grid";
    else this.productView = "list";

    this.scrollToTop();
  }

  scrollToTop() {
    this.content.scrollToTop(700);
    this.scrollTopButton = false;
  }

  onScroll(e) {
    if (e.scrollTop >= 600) {
      this.scrollTopButton = true;
    }
    if (e.scrollTop < 600) {
      this.scrollTopButton = false;
    }
  }

  openCart() {
    this.navCtrl.push(CartContainer);
  }

  ionViewDidLoad() {}

  params(): HttpParams {
    let params = new HttpParams();

    if (this.filterList.brand.trim().length && this.filterList.brand !== "blah") {
      params = params.append("brand", this.filterList.brand);
    }
    if (this.filterList.gamme.trim().length && this.filterList.gamme !== "blah") {
      params = params.append("gamme", this.filterList.gamme);
    }
    if (this.filterList.deystvie.trim().length && this.filterList.deystvie !== "blah") {
      params = params.append("deystvie", this.filterList.deystvie);
    }
    if (this.filterList.mezh_nep_nazvanie.trim().length && this.filterList.mezh_nep_nazvanie !== "blah") {
      params = params.append("mezh_nep_nazvanie", this.filterList.mezh_nep_nazvanie);
    }
    if (this.filterList.tip_volos.trim().length && this.filterList.tip_volos !== "blah") {
      params = params.append("tip_volos", this.filterList.tip_volos);
    }
    if (this.filterList.tip_kozhi.trim().length && this.filterList.tip_kozhi !== "blah") {
      params = params.append("tip_kozhi", this.filterList.tip_kozhi);
    }
    if (this.filterList.form_vypusk.trim().length && this.filterList.form_vypusk !== "blah") {
      params = params.append("form_vypusk", this.filterList.form_vypusk);
    }

    return params;
  }

}
