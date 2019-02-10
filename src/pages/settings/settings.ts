// Project Name: IonicEcommerce
// Project URI: http://ionicecommerce.com
// Author: VectorCoder Team
// Author URI: http://vectorcoder.com/

import { Component } from '@angular/core';
import { NavController, NavParams, ModalController, Events, Platform } from 'ionic-angular';
import { LocalNotifications } from '@ionic-native/local-notifications/ngx';
// import { LanguagePage } from '../language/language';
import { ConfigProvider } from '../../services/config/config';
import { Storage } from '@ionic/storage';
import { Http, RequestMethod, RequestOptions } from '@angular/http';
import { PrivacyPolicyPage } from '../privacy-policy/privacy-policy';
import { TermServicesPage } from '../term-services/term-services';
import { RefundPolicyPage } from '../refund-policy/refund-policy';
import { LoadingProvider } from '../../services/loading/loading';
import { trigger, style, animate, transition, state } from '@angular/animations';
import { SharedDataProvider } from '../../services/shared-data/shared-data';
import { LoginPage } from '../login/login';
import { MyAccountPage } from '../my-account/my-account';
import { InAppBrowser } from '@ionic-native/in-app-browser/ngx';
import { CartContainer } from '../cart/cart-container';
import { SearchPage } from '../search/search';
import { SocialSharing } from '@ionic-native/social-sharing/ngx';
import { AppVersion } from '@ionic-native/app-version/ngx';
import { HomePage} from '../home/home';
import { HttpClient } from '@angular/common/http';
import { selectCartProductsLength } from '../../app/store';
import { Store } from '@ngrx/store';



@Component({
  selector: 'page-settings',
  templateUrl: 'settings.html',
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
export class SettingsPage {
  productsLength$ = this.store.select(selectCartProductsLength);

  setting: { [k: string]: any } = {};
  SearchList = false;
  Search_result;
  

  search = {
    "search_string": '',
  };

  constructor(
    private store: Store<any>,
    public navCtrl: NavController,
    public navParams: NavParams,
    public modalCtrl: ModalController,
    public config: ConfigProvider,
    private storage: Storage,
    public loading: LoadingProvider,
    public http: HttpClient,
    private localNotifications: LocalNotifications,
    public events: Events,
    public shared: SharedDataProvider,
    public iab: InAppBrowser,
    private socialSharing: SocialSharing,
    public plt: Platform,
    private appVersion: AppVersion
  ) {

  }


  turnOnOffNotification(value) {
    if (this.setting.localNotification == false) {
      this.localNotifications.cancel(1).then((result) => {
      });
    }
    else {
      this.localNotifications.schedule({
        id: 1,
        title: this.config.notifTitle,
        text: this.config.notifText,
        every: this.config.notifDuration,
      });
    }

    // this.updateSetting();
  }


  showHideSearchList(){
    console.log("Search status");
    console.log(this.SearchList);
    if (this.SearchList == false) { this.SearchList = true; }
    else { this.SearchList = false;}
  }

  getSearch(){
    this.http.get(this.config.url + 'catalog/search/?q=' + this.search.search_string).subscribe(data => {
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

  // updateSetting() {
  //   console.log(this.setting);
  //   this.storage.set('setting', this.setting);
  // }

  openLoginPage() {
    let modal = this.modalCtrl.create(LoginPage);
    modal.present();
  }

  // logOut() {
  //   this.shared.logOut();
  //   this.navCtrl.push(HomePage);
  // }

  openPage(page) {
    if (page == 'myAccount') this.navCtrl.push(MyAccountPage);
  }

  openSite() {
    this.loading.autoHide(2000);
    this.iab.create(this.config.siteUrl, "blank");
  }
  //============================================================================================
  //turning on off local  notification
  // onOffPushNotification() {
  //   this.storage.get('registrationId').then((registrationId) => {
  //     var data: { [k: string]: any } = {};
  //     data.device_id = registrationId;
  //     if (this.setting.notification == false) data.is_notify = 0;
  //     else data.is_notify = 1;
  //     this.http.post(this.config.url + 'notify_me', data).map(res => res.json()).subscribe(data => {
  //       if (data.success == 1) {
  //
  //         this.updateSetting();
  //       }
  //     }, function (response) {
  //       console.log(response);
  //     });
  //   });
  // };

  onOffNotificationEmail() {
    let {email} = JSON.parse(localStorage.getItem('localInfo'));

    if (this.setting.notificationEmail) {
      this.http.post(this.config.url + 'tools/subscribe', {email}).subscribe(data => {
        console.log(data);
        localStorage.setItem('notificationEmail', 'true');
      }, (response) => {
        console.log(response);
        localStorage.setItem('notificationEmail', 'false');
      });
    } else {
      this.http.request('delete', this.config.url + 'tools/subscribe', {body: {email: email}}).subscribe(data => {
        console.log(data);
        localStorage.setItem('notificationEmail', 'false');
      }, (response) => {
        console.log(response);
      });
    }
  };

  hideShowFooterMenu() {
    // this.events.publish('setting', this.setting);
    // this.updateSetting();
  }
  hideShowCartButton() {
    // this.events.publish('setting', this.setting);
    // this.updateSetting();
  }
  showModal(value) {
    this.loading.autoHide(1000);
    if (value == 'privacyPolicy') {
      let modal = this.modalCtrl.create(PrivacyPolicyPage);
      modal.present();
    }
    else if (value == 'termServices') {
      let modal = this.modalCtrl.create(TermServicesPage);
      modal.present();
    }
    // else if (value == 'language') {
    //   let modal = this.modalCtrl.create(LanguagePage);
    //   modal.present();
    // }
    else {
      let modal = this.modalCtrl.create(RefundPolicyPage);
      modal.present();
    }
  }
  ionViewDidLoad() {
    this.setting.localNotification = false;
    let val = JSON.parse(localStorage.getItem('notificationEmail'));
    // this.storage.get('setting').then((val) => {
      if (val != null || val != undefined) {
        this.setting.notificationEmail = val;
      }
      else {
        // this.setting.localNotification = false;
        this.setting.notificationEmail = false;
        // this.setting.cartButton = false;
        // this.setting.footer = false;
      }
    // });
  }

  openCart() {
    this.navCtrl.push(CartContainer);
  }
  openSearch() {
    this.navCtrl.push(SearchPage);
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
        this.config.packgeName.toString(),
        this.config.appName,
        this.config.packgeName.toString(),
        this.config.packgeName.toString()
      ).then(() => {
      }).catch(() => {

      });
    } else if (this.plt.is('android')) {

      this.appVersion.getPackageName().then((val) => {
        this.socialSharing.share(
          this.config.appName,
          this.config.appName,
          "",
          "https://play.google.com/store/apps/details?id=" + val
        ).then(() => {

        }).catch(() => {
        });
      });
    }
  }
  showAd() {
    this.loading.autoHide(2000);
    this.events.publish('showAd');
  }
}
