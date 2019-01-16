import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { ViewController, ModalController } from 'ionic-angular';
import { SignUpPage } from '../sign-up/sign-up';
import { Http } from '@angular/http';
import { ConfigProvider } from '../../services/config/config';
import { LoadingProvider } from '../../services/loading/loading';
import { ForgotPasswordPage } from '../forgot-password/forgot-password';
import { SharedDataProvider } from '../../services/shared-data/shared-data';
import { Facebook, FacebookLoginResponse } from '@ionic-native/facebook';
import { AlertProvider } from '../../services/alert/alert';
import { GooglePlus } from '@ionic-native/google-plus';
import { AppVersion } from '@ionic-native/app-version';
import { MenuController } from 'ionic-angular';
import { App} from 'ionic-angular';
import { HomePage } from '../home/home';
import { Events } from 'ionic-angular';
import { InAppBrowser, InAppBrowserEvent } from '@ionic-native/in-app-browser';
/**
 * Generated class for the LoginmodalPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-loginmodal',
  templateUrl: 'loginmodal.html',
})
export class LoginmodalPage {
  response;

  constructor(
    public http: Http,
    public config: ConfigProvider,
    public viewCtrl: ViewController,
    public modalCtrl: ModalController,
    public loading: LoadingProvider,
    public shared: SharedDataProvider,
    private appVersion: AppVersion,
    public menuCtrl: MenuController,
    public appCtrl: App,
    private fb: Facebook,
    public events: Events,
    public alert: AlertProvider,
    private iab: InAppBrowser,
    private googlePlus: GooglePlus
  ) {
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad LoginmodalPage');
  }

  senter(){
        var VkData = new FormData();
        VkData.append('email', localStorage.getItem('sentEmail'));
        VkData.append('socialToken', localStorage.getItem('token'));
        VkData.append('socialType','vk');
    
        alert("Function next");
        this.http.post(this.config.url + 'auth/login', VkData).map(res => res.json()).subscribe(data => {
          this.loading.hide();
          alert("You Win");
          console.log("User info login");
          console.log(data);
          this.response = data;
          console.log("Ошибок нету"); 
          this.shared.userInfo(this.response.result);
            
          this.viewCtrl.dismiss();
          this.appCtrl.getRootNav().setRoot(HomePage);
          this.menuCtrl.close();
        },
        err => {
          this.loading.hide();
          alert("Whoops!");
          alert(err);
          alert(err.status);
          console.log(err)
          if(err.status = 422){
            alert("Были введены неправильные е-мейл или пароль.Попробуйте, ещё раз!")
          }
        });
  }

  ngOnInit() {
      this.senter();
  }
}
