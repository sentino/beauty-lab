import { Component } from '@angular/core';
import { NavController, NavParams, ModalController, Events, Platform } from 'ionic-angular';
import { LocalNotifications } from '@ionic-native/local-notifications/ngx';
import { ConfigProvider } from '../../services/config/config';
import { Storage } from '@ionic/storage';
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
import { HttpClient } from '@angular/common/http';
import { selectCartProductsLength } from '../../app/store';
import { Store } from '@ngrx/store';
import { InfoPageComponent } from '../contact-page/info-page.component';



@Component({
  selector: 'page-settings',
  templateUrl: 'settings.html',
  animations: [
    trigger('shakeCart', [
      state('inactive', style({
        animation: 'shake 0.75s'
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

  openLoginPage() {
    let modal = this.modalCtrl.create(LoginPage);
    modal.present();
  }

  openPage(page) {
    if (page == 'myAccount') this.navCtrl.push(MyAccountPage);
    else if (page == 'about') this.navCtrl.setRoot(InfoPageComponent, {page: 'about'});
    else if (page == 'guarantees') this.navCtrl.setRoot(InfoPageComponent, {page: 'guarantees'});
    else if (page == 'agreement') this.navCtrl.setRoot(InfoPageComponent, {page: 'agreement'});
    else if (page == 'privacy-policy') this.navCtrl.setRoot(InfoPageComponent, {page: 'privacy-policy'});
    else if (page == 'license') this.navCtrl.setRoot(InfoPageComponent, {page: 'license'});
  }

  onOffNotificationEmail() {
    let {email} = JSON.parse(localStorage.getItem('localInfo'));

    if (this.setting.notificationEmail) {
      this.http.post(this.config.url + 'tools/subscribe', {email}).subscribe(data => {
        localStorage.setItem('notificationEmail', 'true');
      }, (response) => {
        localStorage.setItem('notificationEmail', 'false');
      });
    } else {
      this.http.request('delete', this.config.url + 'tools/subscribe', {body: {email: email}}).subscribe(data => {
        localStorage.setItem('notificationEmail', 'false');
      }, (response) => {
      });
    }
  };

  ionViewDidLoad() {
    this.setting.localNotification = false;
    let val = JSON.parse(localStorage.getItem('notificationEmail'));
      if (val != null || val != undefined) {
        this.setting.notificationEmail = val;
      } else {
        this.setting.notificationEmail = false;
      }
  }

  openCart() {
    this.navCtrl.push(CartContainer);
  }

  openSearch() {
    this.navCtrl.push(SearchPage);
  }

  // rateUs() {
  //   this.loading.autoHide(2000);
  //   if (this.plt.is('ios')) {
  //     this.iab.create(this.config.packgeName.toString(), "_system");
  //   } else if (this.plt.is('android')) {
  //     this.appVersion.getPackageName().then((val) => {
  //       this.iab.create("https://play.google.com/store/apps/details?id=" + val, "_system");
  //     });
  //   }
  // }

  share() {
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
    this.events.publish('showAd');
  }
}
