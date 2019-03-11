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
import { LazyLoadImageModule } from 'ng-lazyload-image';
import { MyApp } from './app.component';
import { HomePage } from '../pages/home/home';
import { StatusBar } from '@ionic-native/status-bar/ngx';
import { SplashScreen } from '@ionic-native/splash-screen/ngx';
import { ConfigProvider } from '../services/config/config';
import { IonicStorageModule } from '@ionic/storage';
import { SignUpPage } from '../pages/sign-up/sign-up';
import { LoginPage } from '../pages/login/login';
import { ModalModule } from 'ngx-bootstrap/modal';
import { LoadingProvider } from '../services/loading/loading';
import { SharedDataProvider } from '../services/shared-data/shared-data';
import { ForgotPasswordPage } from '../pages/forgot-password/forgot-password';
import { FooterComponent } from '../components/footer/footer';
import { ProductDetailPage } from '../pages/product-detail/product-detail';
import { HeaderComponent } from '../components/header/header';
import { CartContainer } from '../pages/cart/cart-container';
import { CurencyPipe } from '../helpers/pipe/curency';
import { Toast } from '@ionic-native/toast/ngx';
import { SearchPage } from '../pages/search/search';
import { AlertProvider } from '../services/alert/alert';
import { ProductsPage } from '../pages/products/products';
import { WishListPage } from '../pages/wish-list/wish-list';
import { SocialSharing } from '@ionic-native/social-sharing/ngx';
import { Stripe } from '@ionic-native/stripe/ngx';
import { PayPal } from '@ionic-native/paypal/ngx';
import { MyAccountPage } from '../pages/my-account/my-account';
import { MyOrdersPage } from '../pages/my-orders/my-orders';
import { SettingsPage } from '../pages/settings/settings';
import { LocalNotifications } from '@ionic-native/local-notifications/ngx';
import { Push } from '@ionic-native/push/ngx';
import { Device } from '@ionic-native/device/ngx';
import { Facebook } from '@ionic-native/facebook/ngx';
import { GooglePlus } from '@ionic-native/google-plus/ngx';
import { Categories3Page } from '../pages/categories3/categories3';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { Network } from '@ionic-native/network/ngx';
import { InAppBrowser } from '@ionic-native/in-app-browser/ngx';
import { FCM } from '@ionic-native/fcm/ngx';
import { AppVersion } from '@ionic-native/app-version/ngx';
import { OneSignal } from '@ionic-native/onesignal/ngx';
import { BrMaskerModule } from '../../br-masker-ionic-3/src';
import { StarRatingModule } from 'ionic3-star-rating';
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
import { StoreModule } from '@ngrx/store';
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
import { InfoPageComponent } from '../pages/contact-page/info-page.component';
import { SearchService } from '../services/search.service';
import { MatSelectModule } from '@angular/material';
import { GoogleAnalytics } from '@ionic-native/google-analytics/ngx';

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

const CONTENT_PAGES_MODULE = [
  InfoPageComponent
];

const PAGES = [
  MyApp,
  HomePage,
  SearchPage,
  Categories3Page,
  HealthCatalogPage,
  BeautyCatalogPage,
  ProductsPage,
  LoginPage,
  SignUpPage,
  WishListPage,
  ForgotPasswordPage,
  HeaderComponent,
  MyAccountPage,
  FooterComponent,
  ProductDetailPage,
  MyOrdersPage,
  SettingsPage,
  ...SHARED_MODULE,
  ...ORDER_MODULE,
  ...CART_MODULE,
  ...BRANDS_MODULE,
  ...MEDICINES_MODULE,
  ...SUBSTANCES_MODULE,
  ...MEDICINES_SUBSTANCES_MODULE,
  ...ARTICLES_PROMOTIONS_MODULE,
  ...CONSULTATION_MODULE,
  ...CONTENT_PAGES_MODULE
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
      mode:'md'
    }),
    StoreModule.forRoot({main: reducer}),
    EffectsModule.forRoot([MainEffects]),
    StoreDevtoolsModule.instrument({
      maxAge: 25, // Retains last 25 states
      }),
    BrowserModule,
    HttpClientModule,
    BrMaskerModule,
    StarRatingModule,
    BrowserAnimationsModule,
    IonicStorageModule.forRoot(),
    LazyLoadImageModule,
    MatSelectModule
  ],
  declarations: [
    HrefDirective,
    ...PAGES,
    ...PIPES
  ],
  entryComponents: [...PAGES],
  providers: [
    GoogleAnalytics,
    SearchService,
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
    { provide: HTTP_INTERCEPTORS, useClass: JwtInterceptor, multi: true },
    { provide: ErrorHandler, useClass: IonicErrorHandler },
    LoadingProvider,
    SharedDataProvider,
    Stripe,
    AlertProvider,
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
