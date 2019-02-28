// Project Name: IonicEcommerce
// Project URI: http://ionicecommerce.com
// Author: VectorCoder Team
// Author URI: http://vectorcoder.com/
// Version: 1.0

// import { CommonModule } from '@angular/common';


import { HTTP_INTERCEPTORS, HttpClientModule } from '@angular/common/http';


if (localStorage.langId == undefined) {
  localStorage.langId = '1';
}
if (localStorage.direction == undefined) {
  localStorage.direction = 'ltr';
}

import { BrowserModule } from '@angular/platform-browser';
import { ErrorHandler, NgModule } from '@angular/core';
import { IonicApp, IonicErrorHandler, IonicModule } from 'ionic-angular';
// import { HttpModule, Http } from '@angular/http';
import { LazyLoadImageModule } from 'ng-lazyload-image';
import { MyApp } from './app.component';
import { HomePage } from '../pages/home/home';
import { StatusBar } from '@ionic-native/status-bar/ngx';
import { SplashScreen } from '@ionic-native/splash-screen/ngx';
import { ConfigProvider } from '../services/config/config';
// import { createTranslateLoader } from '../services/translate/translate';
// import { TranslateLoader, TranslateModule } from '@ngx-translate/core';
import { IonicStorageModule } from '@ionic/storage';
import { ProductsProvider } from '../services/products/products';
import { LoginmodalPage } from '../pages/loginmodal/loginmodal';
// import { LanguagePage } from '../pages/language/language';
import { SignUpPage } from '../pages/sign-up/sign-up';
import { LoginPage } from '../pages/login/login';
import { ModalModule } from 'ngx-bootstrap/modal';
import { IntroPage } from '../pages/intro/intro';
import { AboutUsPage } from '../pages/about-us/about-us';
import { ContactUsPage } from '../pages/contact-us/contact-us';
import { LoadingProvider } from '../services/loading/loading';
import { SharedDataProvider } from '../services/shared-data/shared-data';

import { ForgotPasswordPage } from '../pages/forgot-password/forgot-password';

import { BannersComponent } from '../components/banners/banners';
import { ProductComponent } from '../components/product/product';
import { FooterComponent } from '../components/footer/footer';
//import { ComponentsModule } from '../components/components.module';
import { SlidingTabsComponent } from '../components/sliding-tabs/sliding-tabs';
import { ProductDetailPage } from '../pages/product-detail/product-detail';
import { HeaderComponent } from '../components/header/header';
import { CartContainer } from '../pages/cart/cart-container';
import { CurencyPipe } from '../pipes/curency/curency';
import { Toast } from '@ionic-native/toast/ngx';
import { SearchPage } from '../pages/search/search';
import { AlertProvider } from '../services/alert/alert';
import { CategoriesPage } from '../pages/categories/categories';
import { ProductsPage } from '../pages/products/products';
import { WishListPage } from '../pages/wish-list/wish-list';
import { ShippingAddressPage } from '../pages/shipping-address/shipping-address';
import { SelectCountryPage } from '../pages/select-country/select-country';
import { SelectZonesPage } from '../pages/select-zones/select-zones';
import { BillingAddressPage } from '../pages/billing-address/billing-address';
import { ShippingMethodPage } from '../pages/shipping-method/shipping-method';
import { OrderPage } from '../pages/order/order';
import { SocialSharing } from '@ionic-native/social-sharing/ngx';
import { ThankYouPage } from '../pages/thank-you/thank-you';
import { Stripe } from '@ionic-native/stripe/ngx';
import { CouponProvider } from '../services/coupon/coupon';
import { PayPal } from '@ionic-native/paypal/ngx';
import { MyAccountPage } from '../pages/my-account/my-account';
import { MyShippingAddressesPage } from '../pages/my-shipping-addresses/my-shipping-addresses';
import { EditShippingAddressPage } from '../pages/edit-shipping-address/edit-shipping-address';
import { MyOrdersPage } from '../pages/my-orders/my-orders';
import { OrderDetailPage } from '../pages/order-detail/order-detail';
import { NewsPage } from '../pages/news/news';
import { SettingsPage } from '../pages/settings/settings';
import { NewsDetailPage } from '../pages/news-detail/news-detail';
import { NewsListPage } from '../pages/news-list/news-list';
import { LocalNotifications } from '@ionic-native/local-notifications/ngx';
import { Push } from '@ionic-native/push/ngx';
import { Device } from '@ionic-native/device/ngx';
import { Facebook } from '@ionic-native/facebook/ngx';
import { GooglePlus } from '@ionic-native/google-plus/ngx';
import { Categories2Page } from '../pages/categories2/categories2';
import { SubCategoriesPage } from '../pages/sub-categories/sub-categories';
import { Home5Page } from '../pages/home5/home5';
import { Home4Page } from '../pages/home4/home4';
import { Home3Page } from '../pages/home3/home3';
import { Home2Page } from '../pages/home2/home2';
import { Categories3Page } from '../pages/categories3/categories3';
import { Categories4Page } from '../pages/categories4/categories4';
import { Categories5Page } from '../pages/categories5/categories5';
import { PrivacyPolicyPage } from '../pages/privacy-policy/privacy-policy';
import { TermServicesPage } from '../pages/term-services/term-services';
import { RefundPolicyPage } from '../pages/refund-policy/refund-policy';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { Network } from '@ionic-native/network/ngx';
import { SubCategories2Page } from '../pages/sub-categories2/sub-categories2';
import { SubCategories3Page } from '../pages/sub-categories3/sub-categories3';
import { SubCategories4Page } from '../pages/sub-categories4/sub-categories4';
import { SubCategories5Page } from '../pages/sub-categories5/sub-categories5';
import { Categories6Page } from '../pages/categories6/categories6';
import { SubCategories6Page } from '../pages/sub-categories6/sub-categories6';
import { InAppBrowser } from '@ionic-native/in-app-browser/ngx';
import { FCM } from '@ionic-native/fcm/ngx';
import { AppVersion } from '@ionic-native/app-version/ngx';
import { OneSignal } from '@ionic-native/onesignal/ngx';
import { BrMaskerModule } from 'brmasker-ionic-3';
import { StarRatingModule } from 'ionic3-star-rating';
// import { InputMaskModule } from 'ionic-input-mask';
// Import ionic-rating module
// import { IonicRatingModule } from 'ionic-rating';
import { Ionic2RatingModule } from 'ionic2-rating';
import { BeautyCatalogPage } from '../pages/beauty-catalog/beauty-catalog';
import { HealthCatalogPage } from '../pages/health-catalog/health-catalog';
import { FormsModule } from '@angular/forms';
import { JwtInterceptor } from '../helpers/jwt-interceptor';
import { ConfirmOrderContainer } from '../pages/confirm-order/confirm-order-container';
import { ConfirmOrderComponent } from '../pages/confirm-order/confirm-order.component';
import { AppSectionList } from '../pages/confirm-order/components/app-section-list';
import { AppSectionListItemOne } from '../pages/confirm-order/components/app-section-list-item-one';
import { AppSectionListItemTwo } from '../pages/confirm-order/components/app-section-list-item-two';
import { AppSectionListItemThree } from '../pages/confirm-order/components/app-section-list-item-three';
import { AppSectionListItemFour } from '../pages/confirm-order/components/app-section-list-item-four';
import { CartService } from '../services/cart.service';
import { AppCart } from '../pages/cart/components/cart';
import { AppPresents } from '../pages/cart/components/presents';
import { ActionReducerMap, StoreModule } from '@ngrx/store';
import { StoreDevtoolsModule } from '@ngrx/store-devtools';
import { reducer } from './store';
import { EffectsModule } from '@ngrx/effects';
import { MainEffects } from './store/main.effects';
import { BonusesService } from '../services/bonuses.service';
import { WishListService } from '../services/wish-list.service';
import { ModalOneClickOrder } from '../helpers/modal/modalOneClickOrder';
import { OrdersService } from '../services/orders.service';
import { PayPaylerService } from '../services/pay-payler.service';
import { BrandsContainer } from '../pages/brands/brands-container';
import { BrandsComponent } from '../pages/brands/brands.component';
import { SanitizeHtmlPipe } from '../helpers/pipe/sanitize-html.pipe';
import { BrandsPageContainer } from '../pages/brands-page/brands-page-container';
import { BrandsPageComponent } from '../pages/brands-page/brands-page.component';
import { MedicinesContainer } from '../pages/medicines/medicines.container';
import { MedicinesComponent } from '../pages/medicines/medicines.component';
import { SubstancesContainer } from '../pages/substances/substances.container';
import { SubstancesComponent } from '../pages/substances/substances.component';
import { AppProductCartComponent } from '../helpers/cart/app-product-cart.component';
import { MedicinesSubstancesPageContainer } from '../pages/medicines-substances-page/medicines-substances-page.container';
import { MedicinesSubstancesPageComponent } from '../pages/medicines-substances-page/medicines-substances-page.component';
import { ArticlesPromotionsContainer } from '../pages/articles-promotions/articles-promotions-container';
import { ArticlesPromotionsComponent } from '../pages/articles-promotions/articles-promotions.component';
import { ArticlesPromotionsPageContainer } from '../pages/articles-promotions-page/articles-promotions-page-container';
import { ArticlesPromotionsPageComponent } from '../pages/articles-promotions-page/articles-promotions-page.component';
import { HrefDirective } from '../helpers/pipe/href.directive';
import { ConsultationContainer } from '../pages/consultation/consultation-container';
import { ConsultationComponent } from '../pages/consultation/consultation.component';
import { ConsultationCart } from '../pages/consultation/components/consultation-cart';
import { ConsultationQuestion } from '../pages/consultation/components/consultation-question';
import { ConsultationModal } from '../helpers/consultation-modal/consultation-modal';
import { SpecialistPageContainer } from '../pages/consultation/specialist-page/specialist-page-container';
import { SpecialistPageComponent } from '../pages/consultation/specialist-page/specialist-page.component';



// export interface BeautyLabState {
//   // cart: any
// }

// export const reducers: ActionReducerMap<BeautyLabState> = {
//   // cart: cartReducer
// }

const SHARED_MODULE = [
  AppProductCartComponent,
  ModalOneClickOrder,
];

const ORDER_MODULE = [
  ConfirmOrderContainer,
  ConfirmOrderComponent,
  AppSectionList,
  AppSectionListItemOne,
  AppSectionListItemTwo,
  AppSectionListItemThree,
  AppSectionListItemFour
];

const CART_MODULE = [
  CartContainer,
  AppCart,
  AppPresents
];

const BRANDS_MODULE = [
  BrandsContainer,
  BrandsComponent,
  BrandsPageContainer,
  BrandsPageComponent
];

const MEDICINES_MODULE = [
  MedicinesContainer,
  MedicinesComponent
];

const SUBSTANCES_MODULE = [
  SubstancesContainer,
  SubstancesComponent
];

const MEDICINES_SUBSTANCES_MODULE = [
  MedicinesSubstancesPageContainer,
  MedicinesSubstancesPageComponent
];

const ARTICLES_PROMOTIONS_MODULE = [
  ArticlesPromotionsContainer,
  ArticlesPromotionsComponent,
  ArticlesPromotionsPageContainer,
  ArticlesPromotionsPageComponent
];

const CONSULTATION_MODULE = [
  ConsultationContainer,
  ConsultationComponent,
  ConsultationCart,
  ConsultationQuestion,
  ConsultationModal,
  SpecialistPageContainer,
  SpecialistPageComponent
];

const PAGES = [
  MyApp,
  HomePage,
  Home2Page,
  Home3Page,
  Home4Page,
  Home5Page,
  SearchPage,
  CategoriesPage,
  Categories2Page,
  Categories3Page,
  Categories4Page,
  Categories5Page,
  Categories6Page,
  SubCategoriesPage,
  SubCategories2Page,
  SubCategories3Page,
  SubCategories4Page,
  SubCategories5Page,
  SubCategories6Page,
  HealthCatalogPage,
  BeautyCatalogPage,
  IntroPage,
  ProductsPage,
  PrivacyPolicyPage,
  RefundPolicyPage,
  LoginmodalPage,
  ContactUsPage,
  AboutUsPage,
  LoginPage,
  SignUpPage,
  WishListPage,
  ShippingAddressPage,
  ForgotPasswordPage,
  HeaderComponent,
  BannersComponent,
  SelectZonesPage,
  MyShippingAddressesPage,
  BillingAddressPage,
  SelectCountryPage,
  MyAccountPage,
  ProductComponent,
  FooterComponent,
  SlidingTabsComponent,
  ProductDetailPage,
  ShippingMethodPage,
  ThankYouPage,
  OrderPage,
  OrderDetailPage,
  MyOrdersPage,
  TermServicesPage,
  EditShippingAddressPage,
  NewsPage,
  NewsDetailPage,
  NewsListPage,
  SettingsPage,
  ...SHARED_MODULE,
  ...ORDER_MODULE,
  ...CART_MODULE,
  ...BRANDS_MODULE,
  ...MEDICINES_MODULE,
  ...SUBSTANCES_MODULE,
  ...MEDICINES_SUBSTANCES_MODULE,
  ...ARTICLES_PROMOTIONS_MODULE,
  ...CONSULTATION_MODULE
];

const PIPES = [
  CurencyPipe,
  SanitizeHtmlPipe
];

@NgModule({
  imports: [
    FormsModule,
    Ionic2RatingModule,
    ModalModule.forRoot(),
    IonicModule.forRoot(MyApp,{
      backButtonText: '',
      iconMode: 'md',
    }),
    StoreModule.forRoot({main: reducer}),
    EffectsModule.forRoot([MainEffects]),
    // Instrumentation must be imported after importing StoreModule (config is optional)
    StoreDevtoolsModule.instrument({
      maxAge: 25, // Retains last 25 states
      }),
    // HttpModule,
    BrowserModule,
    HttpClientModule,
    BrMaskerModule,
    StarRatingModule,
    BrowserAnimationsModule,
    IonicStorageModule.forRoot(),
    LazyLoadImageModule,
    // TranslateModule.forRoot({
    //   loader: {
    //     provide: TranslateLoader,
    //     useFactory: (createTranslateLoader),
    //     deps: [Http]
    //   }
    // }),
  ],
  declarations: [
    HrefDirective,
    ...PAGES,
    ...PIPES
  ],
  entryComponents: [...PAGES],
  providers: [
    InAppBrowser,
    PayPaylerService,
    OrdersService,
    WishListService,
    BonusesService,
    CartService,
    ConfigProvider,
    StatusBar,
    SplashScreen,
    SocialSharing,
    Toast,
    ConfigProvider,
    ProductsProvider,
    { provide: HTTP_INTERCEPTORS, useClass: JwtInterceptor, multi: true },
    { provide: ErrorHandler, useClass: IonicErrorHandler },
    ProductsProvider,
    LoadingProvider,
    SharedDataProvider,
    Stripe,
    AlertProvider,
    CouponProvider,
    PayPal,
    Push,
    Device,
    Facebook,
    GooglePlus,
    LocalNotifications,
    InAppBrowser,
    Network,
    FCM,
    AppVersion,
    OneSignal
  ],
  bootstrap: [IonicApp]
})
export class AppModule { }
