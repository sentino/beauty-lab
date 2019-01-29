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
import { CartPage } from '../pages/cart/cart';
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

@NgModule({
  declarations: [
    MyApp,
    HomePage,
    SearchPage,
    CartPage,
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
    IntroPage,
    HealthCatalogPage,
    BeautyCatalogPage,
    SubCategoriesPage,
    SubCategories2Page,
    SubCategories3Page,
    SubCategories4Page,
    SubCategories5Page,
    SubCategories6Page,
    ProductsPage,
    LoginmodalPage,
    // LanguagePage,
    ContactUsPage,
    AboutUsPage,
    IntroPage,
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
    CurencyPipe,
    ShippingMethodPage,
    ThankYouPage,
    OrderPage,
    OrderDetailPage,
    MyOrdersPage,
    PrivacyPolicyPage,
    RefundPolicyPage,
    TermServicesPage,
    EditShippingAddressPage,
    NewsPage,
    NewsDetailPage,
    NewsListPage,
    SettingsPage
  ],
  imports: [
    FormsModule,
    Ionic2RatingModule,
    ModalModule.forRoot(),
    IonicModule.forRoot(MyApp,{
      backButtonText: '',
      iconMode: 'md',
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
  bootstrap: [IonicApp],
  entryComponents: [
    MyApp,
    HomePage,
    Home2Page,
    Home3Page,
    Home4Page,
    Home5Page,
    SearchPage,
    HealthCatalogPage,
    CategoriesPage,
    Categories2Page,
    Categories3Page,
    BeautyCatalogPage,
    Categories4Page,
    Categories5Page,
    Categories6Page,
    SubCategoriesPage,
    SubCategories2Page,
    SubCategories3Page,
    SubCategories4Page,
    SubCategories5Page,
    SubCategories6Page,
    IntroPage,
    PrivacyPolicyPage,
    RefundPolicyPage,
    TermServicesPage,
    // LanguagePage,
    ProductsPage,
    ContactUsPage,
    AboutUsPage,
    IntroPage,
    WishListPage,
    ShippingAddressPage,
    CartPage,
    LoginPage,
    SignUpPage,
    BillingAddressPage,
    MyShippingAddressesPage,
    SelectCountryPage,
    SelectZonesPage,
    MyAccountPage,
    ForgotPasswordPage,
    HeaderComponent,
    BannersComponent,
    ProductComponent,
    FooterComponent,
    SlidingTabsComponent,
    ProductDetailPage,
    ShippingMethodPage,
    OrderPage,
    MyOrdersPage,
    OrderDetailPage,
    ThankYouPage,
    EditShippingAddressPage,
    NewsPage,
    NewsDetailPage,
    NewsListPage,
    LoginmodalPage,
    SettingsPage
  ],
  providers: [
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
  ]
})
export class AppModule { }
