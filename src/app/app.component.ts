// Project Name: IonicEcommerce
// Project URI: http://ionicecommerce.com
// Author: VectorCoder Team
// Author URI: http://vectorcoder.com/

import { Component, ViewChild } from '@angular/core';
import { Nav, Platform, ModalController, Events } from 'ionic-angular';
import { StatusBar } from '@ionic-native/status-bar/ngx';
// import { SplashScreen } from '@ionic-native/splash-screen';
import { Storage } from '@ionic/storage';
// import { TranslateService } from '@ngx-translate/core';
import { MenuController } from 'ionic-angular';
import { HomePage } from '../pages/home/home';
// import { LanguagePage } from '../pages/language/language';
import { IntroPage } from '../pages/intro/intro';
import { ContactUsPage } from '../pages/contact-us/contact-us';
import { AboutUsPage } from '../pages/about-us/about-us';
import { SignUpPage } from '../pages/sign-up/sign-up';
import { LoginPage } from '../pages/login/login';
import { ConfigProvider } from '../services/config/config';
import { SharedDataProvider } from '../services/shared-data/shared-data';
import { CategoriesPage } from '../pages/categories/categories';
import { WishListPage } from '../pages/wish-list/wish-list';
import { MyAccountPage } from '../pages/my-account/my-account';
import { MyOrdersPage } from '../pages/my-orders/my-orders';
import { MyShippingAddressesPage } from '../pages/my-shipping-addresses/my-shipping-addresses';
import { NewsPage } from '../pages/news/news';
import { ProductsPage } from '../pages/products/products';
import { SettingsPage } from '../pages/settings/settings';
// import { Network } from '@ionic-native/network';
import { AlertProvider } from '../services/alert/alert';
import { LoadingProvider } from '../services/loading/loading';
import { Home2Page } from '../pages/home2/home2';
import { Home3Page } from '../pages/home3/home3';
import { Home4Page } from '../pages/home4/home4';
import { Home5Page } from '../pages/home5/home5';
import { Categories2Page } from '../pages/categories2/categories2';
import { Categories4Page } from '../pages/categories4/categories4';
import { Categories5Page } from '../pages/categories5/categories5';
import { Categories3Page } from '../pages/categories3/categories3';
import { Categories6Page } from '../pages/categories6/categories6';
import { trigger, transition, animate, style } from '@angular/animations';
// import { AppVersion } from '@ionic-native/app-version';
import { InAppBrowser } from '@ionic-native/in-app-browser/ngx';
// import { SocialSharing } from '@ionic-native/social-sharing';
import { Http } from '@angular/http';
import { CartContainer } from '../pages/cart/cart-container';
// import { NavController } from 'ionic-angular';
import { App} from 'ionic-angular';
import { BeautyCatalogPage } from '../pages/beauty-catalog/beauty-catalog';
import { HealthCatalogPage } from '../pages/health-catalog/health-catalog';
import { HttpClient } from '@angular/common/http';
import { SplashScreen } from '@ionic-native/splash-screen/ngx';
import { Network } from '@ionic-native/network/ngx';
import { AppVersion } from '@ionic-native/app-version/ngx';
import { SocialSharing } from '@ionic-native/social-sharing/ngx';
import { GetDataCartAction, InitDataCart } from './store';
import { Store } from '@ngrx/store';
import { BrandsContainer } from '../pages/brands/brands-container';
import { MedicinesContainer } from '../pages/medicines/medicines.container';
import { SubstancesContainer } from '../pages/substances/substances.container';
import { ArticlesPromotionsContainer } from '../pages/articles-promotions/articles-promotions-container';
import { ConsultationContainer } from '../pages/consultation/consultation-container';
import { InfoPageComponent } from '../pages/contact-page/info-page.component';


@Component({
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
    )
  ],
  templateUrl: 'app.html'
})
export class MyApp {

  @ViewChild(Nav) nav: Nav;

  rootPage: any;

  homeList = false;
  homeListIcon = 'add';
  categoriesList = false;
  categoriesListTwo = false;
  ProfileList = false;
  categoriesListIcon = 'add';
  categoriesTwoListIcon = 'add';
  categoriesLoginIcon = 'add';
  shopList = false;
  shopListIcon = 'add';
  healthSubs;
  beautySubs;
  


  constructor(
    public platform: Platform,
    public modalCtrl: ModalController,
    private statusBar: StatusBar,
    public splashScreen: SplashScreen,
    // translate: TranslateService,
    public storage: Storage,
    public appCtrl: App,
    public menuCtrl: MenuController,
    public shared: SharedDataProvider,
    public http: HttpClient,
    public config: ConfigProvider,
    public network: Network,
    public alert: AlertProvider,
    public loading: LoadingProvider,
    public events: Events,
    public plt: Platform,
    private appVersion: AppVersion,
    public iab: InAppBrowser,
    private socialSharing: SocialSharing,
    private store: Store<any>

  ) {
    //open intro page on start
    storage.get('introPage').then((val) => {
      if (val == undefined) {
        this.nav.push(LoginPage);
        storage.set('introPage', 'firstTime');
      }
    });

    let connectedToInternet = true;
    network.onDisconnect().subscribe(() => {
      connectedToInternet = false;
      // translate.get(["Please Connect to the Internet!", "Disconnected"]).subscribe((res) => {
        this.alert.showWithTitle("Please Connect to the Internet!", "Disconnected");
      // });
      //  console.log('network was disconnected :-(');

    });

    network.onConnect().subscribe(() => {
      if (!connectedToInternet) {
        window.location.reload();
        //this.loading.show();
        //console.log('network connected!');
        // translate.get(["Network connected Reloading Data", "Connected"]).subscribe((res) => {
          this.alert.showWithTitle("Network connected Reloading Data" + '...', "Connected");
        // });

      }
      //connectSubscription.unsubscribe();
    });
    // this.platform.setDir(localStorage.direction, true);
    // shared.dir = localStorage.direction;
    // //setting default languge on start up 
    // translate.setDefaultLang(this.config.langId);
    //if(this.config.siteSetting()){
    this.initializeApp();
    //}
  }

  initializeApp() {
    this.platform.ready().then(() => {
      this.store.dispatch(new GetDataCartAction());
      this.rootPage = HomePage;
      setTimeout(() => { this.splashScreen.hide(); }, 2000);
      this.statusBar.styleLightContent();

      // console.log("Beauty App:");
      // console.log(this.shared.subCategoriesBeauty);
      this.healthSubs = this.shared.subCategoriesBeauty;
  
      // console.log("Health App:");
      // console.log(this.shared.subCategoriesHealth);
      this.beautySubs = this.shared.subCategoriesHealth;

    });
  }

  openCart() {
      this.nav.push(CartContainer);
  }

  openPage(page) {
    if (page == 'home') this.openHomePage();
    else if (page == 'home1') this.nav.setRoot(HomePage);
    else if (page == 'home2') this.nav.setRoot(Home2Page);
    else if (page == 'home3') this.nav.setRoot(Home3Page);
    else if (page == 'home4') this.nav.setRoot(Home4Page);
    else if (page == 'home5') this.nav.setRoot(Home5Page);
    else if (page == 'categories') this.openCategoryPage();
    else if (page == 'categories1') this.nav.setRoot(CategoriesPage);
    else if (page == 'categories2') this.nav.setRoot(Categories2Page);
    else if (page == 'categories3') this.nav.setRoot(Categories3Page);
    else if (page == 'categories4') this.nav.setRoot(Categories4Page);
    else if (page == 'categories5') this.nav.setRoot(Categories5Page);
    else if (page == 'categories6') this.nav.setRoot(Categories6Page);
    else if (page == 'products') this.nav.setRoot(ProductsPage);
    else if (page == 'myWishList') this.nav.setRoot(WishListPage);
    else if (page == 'myShippingAddresses') this.nav.setRoot(MyShippingAddressesPage);
    else if (page == 'myAccount') this.nav.setRoot(MyAccountPage);
    else if (page == 'myOrders') this.nav.setRoot(MyOrdersPage);
    else if (page == 'contactUs') this.nav.setRoot(ContactUsPage);
    else if (page == 'aboutUs') this.nav.setRoot(AboutUsPage);
    else if (page == 'news') this.nav.setRoot(NewsPage);
    else if (page == 'intro') this.nav.setRoot(IntroPage);
    else if (page == 'settings') this.nav.setRoot(SettingsPage);
    else if (page == 'brands') this.nav.setRoot(BrandsContainer);
    else if (page == 'medicines') this.nav.setRoot(MedicinesContainer);
    else if (page == 'substances') this.nav.setRoot(SubstancesContainer);
    else if (page == 'promotions') this.nav.setRoot(ArticlesPromotionsContainer, {type: 'promotions'});
    else if (page == 'articles') this.nav.setRoot(ArticlesPromotionsContainer, {type: 'articles'});
    else if (page == 'consultation') this.nav.setRoot(ConsultationContainer);
    else if (page == 'contacts') this.nav.setRoot(InfoPageComponent, {page: 'contacts'});
    else if (page == 'about') this.nav.setRoot(InfoPageComponent, {page: 'about'});
    else if (page == 'license') this.nav.setRoot(InfoPageComponent, {page: 'license'});
    else if (page == 'guarantees') this.nav.setRoot(InfoPageComponent, {page: 'guarantees'});
    else if (page == 'legal-entities') this.nav.setRoot(InfoPageComponent, {page: 'legal-entities'});
    else if (page == 'privacy-policy') this.nav.setRoot(InfoPageComponent, {page: 'privacy-policy'});
    else if (page == 'agreement') this.nav.setRoot(InfoPageComponent, {page: 'agreement'});
    else if (page == 'newest') this.nav.push(ProductsPage, { sortOrder: 'newest' });
    else if (page == 'topSeller') this.nav.push(ProductsPage, { sortOrder: 'top seller' });
    else if (page == 'deals') this.nav.push(ProductsPage, { sortOrder: 'special' });
    else if (page == 'mostLiked') this.nav.push(ProductsPage, { sortOrder: 'most liked' });
  }

  openCatalog(catalog_id){
    this.nav.setRoot(ProductsPage, { id_cat: catalog_id});
  }

  openBeautyCatalog(page){
    this.shared.selectedFooterPage = page;
    this.nav.setRoot(BeautyCatalogPage);
  }

  openHealthCatalog(page){
    this.shared.selectedFooterPage = page;
    this.nav.setRoot(HealthCatalogPage);
  }

  

  openHomePage() {
    if (this.config.homePage == 1) { this.nav.setRoot(HomePage); }
    if (this.config.homePage == 2) { this.nav.setRoot(Home2Page); }
    if (this.config.homePage == 3) { this.nav.setRoot(Home3Page); }
    if (this.config.homePage == 4) { this.nav.setRoot(Home4Page); }
    if (this.config.homePage == 5) { this.nav.setRoot(Home5Page); }
  }
  openCategoryPage() {
    if (this.config.categoryPage == 1) { this.nav.setRoot(CategoriesPage); }
    if (this.config.categoryPage == 2) { this.nav.setRoot(Categories2Page); }
    if (this.config.categoryPage == 3) { this.nav.setRoot(Categories3Page); }
    if (this.config.categoryPage == 4) { this.nav.setRoot(Categories4Page); }
    if (this.config.categoryPage == 5) { this.nav.setRoot(Categories5Page); }
    if (this.config.categoryPage == 6) { this.nav.setRoot(Categories6Page); }
  }

  // openLanguagePage() {
    // let modal = this.modalCtrl.create(LanguagePage);
    // modal.present();
  // }

  dismiss(){
    this.menuCtrl.close();
  }

  openLoginPage() {
    let modal = this.modalCtrl.create(LoginPage);
    modal.present();
  }
  openSignUpPage() {
    let modal = this.modalCtrl.create(SignUpPage);
    modal.present();
  }
  logOut() {
    this.shared.logOut();
    this.menuCtrl.close();
    this.appCtrl.getRootNav().setRoot(HomePage);
    this.store.dispatch(new InitDataCart());
  }
  showHideHomeList() {
    if (this.homeList == false) { this.homeList = true; this.homeListIcon = 'close'; }
    else { this.homeList = false; this.homeListIcon = 'add'; }
  }
  showHideCategoriesList() {
    if (this.categoriesList == false) { this.categoriesList = true; this.categoriesListIcon = 'close'; }
    else { this.categoriesList = false; this.categoriesListIcon = 'add'; }
  }

  showHideCategoriesTwoList() {
    if (this.categoriesListTwo == false) { this.categoriesListTwo = true; this.categoriesTwoListIcon = 'close'; }
    else { this.categoriesListTwo = false; this.categoriesTwoListIcon = 'add'; }
  }

  showHideLoginList() {
    if (this.ProfileList == false) { this.ProfileList = true; this.categoriesLoginIcon = 'close'; }
    else { this.ProfileList = false; this.categoriesLoginIcon = 'add'; }
  }

  showHideShopList() {
    if (this.shopList == false) { this.shopList = true; this.shopListIcon = 'close'; }
    else { this.shopList = false; this.shopListIcon = 'add'; }
  }
  ionViewWillEnter() {

    // console.log("ionViewCanEnter");
  }
  rateUs() {
    this.loading.autoHide(2000);
    if (this.plt.is('ios')) {
      this.iab.create(this.config.packgeName.toString(), "_system");
    } else if (this.plt.is('android')) {
      this.appVersion.getPackageName().then((val) => {
        this.iab.create("https://play.google.com/store/apps/details?id=" + val, "_system");
      });
    }
  }

  share() {
    this.loading.autoHide(2000);
    if (this.plt.is('ios')) {
      this.socialSharing.share(
        "Nice Application",
        this.config.appName,
        "assets/logo_header.png",
        this.config.packgeName.toString()
      ).then(() => {
      }).catch(() => {

      });
    } else if (this.plt.is('android')) {

      this.appVersion.getPackageName().then((val) => {
        this.socialSharing.share(
          "Nice Application",
          this.config.appName,
          "assets/logo_header.png",
          "https://play.google.com/store/apps/details?id=" + val
        ).then(() => {

        }).catch(() => {
        });
      });
    }
  }
}
