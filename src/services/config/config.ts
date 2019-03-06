import { Injectable } from "@angular/core";
import { LocalNotifications } from "@ionic-native/local-notifications/ngx";
import { Storage } from '@ionic/storage';
import { Platform } from "ionic-angular";
import { OneSignal } from "@ionic-native/onesignal/ngx";
import { HttpClient } from '@angular/common/http';





@Injectable()

export class ConfigProvider {
  // public url: string = '/v1/';
  public url: string = 'https://api.lab-krasoty.ru/api/v1/';
  public langId: string = localStorage.langId;
  public loader = 'dots';
  public newProductDuration = 100;
  public cartButton = 1;//1 = show and 0 = hide
  public currency = "₽";
  public currencyPos = "right";
  public paypalCurrencySymbol = 'USD';
  public address;
  public fbId;
  public email;
  public latitude;
  public longitude;
  public phoneNo;
  public pushNotificationSenderId;
  public lazyLoadingGif;
  public notifText;
  public notifTitle;
  public notifDuration;
  public footerShowHide;
  public homePage = 1;
  public categoryPage = 1;
  public siteUrl = '';
  public appName = '';
  public packgeName = "";
  public introPage = 1;
  public myOrdersPage = 1;
  public newsPage = 1;
  public wishListPage = 1;
  public shippingAddressPage = 1;
  public aboutUsPage = 1;
  public contactUsPage = 1;
  public editProfilePage = 1;
  public settingPage = 1;
  public admob = 1;
  public admobBannerid = '';
  public admobIntid = '';
  public admobIos = 1;
  public admobBanneridIos = '';
  public admobIntidIos = '';
  public googleAnalaytics = "";
  public rateApp = 1;
  public shareApp = 1;
  public fbButton = 1;
  public googleButton = 1;
  public notificationType = "";
  public onesignalAppId = "";
  public onesignalSenderId = "";

  constructor(
    public http: HttpClient,
    private storage: Storage,
    public platform: Platform,
    private oneSignal: OneSignal,
    private localNotifications: LocalNotifications,
  ) { }

  //Subscribe for local notification when application is start for the first time
  setLocalNotification() {
    this.platform.ready().then(() => {
      this.storage.get('localNotification').then((val) => {
        if (val == undefined) {
          this.storage.set('localNotification', 'localNotification');
          this.localNotifications.schedule({
            id: 1,
            title: this.notifTitle,
            text: this.notifText,
            every: this.notifDuration,
          });
        }
      });
    });
  }


}
