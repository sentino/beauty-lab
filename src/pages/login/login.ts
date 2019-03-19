import { Component } from "@angular/core";
import { ViewController, ModalController } from "ionic-angular";
import { SignUpPage } from "../sign-up/sign-up";
import { ConfigProvider } from "../../services/config/config";
import { LoadingProvider } from "../../services/loading/loading";
import { ForgotPasswordPage } from "../forgot-password/forgot-password";
import { SharedDataProvider } from "../../services/shared-data/shared-data";
import { Facebook, FacebookLoginResponse } from "@ionic-native/facebook/ngx";
import { AlertProvider } from "../../services/alert/alert";
import { GooglePlus } from "@ionic-native/google-plus/ngx";
import { AppVersion } from "@ionic-native/app-version/ngx";
import { MenuController } from "ionic-angular";
import { App} from "ionic-angular";
import { Events } from "ionic-angular";
import { InAppBrowser } from "@ionic-native/in-app-browser/ngx";
import { BsModalService } from "ngx-bootstrap/modal";
import { VK } from "ng2-cordova-oauth/core";
import {OauthCordova} from "ng2-cordova-oauth/platform/cordova";
import { NavController } from "ionic-angular";
import { HttpClient } from "@angular/common/http";
import { FormControl, FormGroup, Validators } from "@angular/forms";
import { Store } from '@ngrx/store';
import { GetDataCartAction } from '../../app/store';
import { AnalyticsService } from '../../services/analytics.service';


@Component({
  selector: "page-login",
  templateUrl: "login.html",

})
export class LoginPage {

  get emailControl(): FormControl {
    return this.form.get("email") as FormControl;
  }

  formData = { 
    email: "", 
    password: "", 
    socialToken: "",
    socialType: ""   
  };

  form: FormGroup;

  
  errorMessage = "";
  response;
  par_array;
  url;

  oauth = new OauthCordova();

  social_info;

  vkProvider:VK = new VK({
    clientId:"6410035",
    redirectUri: "https://oauth.vk.com/blank.html",
    appScope : ["friends,offline,email"]
  });

  constructor(
    private store: Store<any>,
    public http: HttpClient,
    public config: ConfigProvider,
    public viewCtrl: ViewController,
    private modalService: BsModalService,
    public modalCtrl: ModalController,
    public loading: LoadingProvider,
    public shared: SharedDataProvider,
    private appVersion: AppVersion,
    public menuCtrl: MenuController,
    public appCtrl: App,
    public navCtrl: NavController,
    private fb: Facebook,
    public events: Events,
    public alert: AlertProvider,
    private iab: InAppBrowser,
    private googlePlus: GooglePlus,
    private ga: AnalyticsService
  ) {
    this.ga.trackPage('authorization');

    this.form = new FormGroup({
      email: new FormControl(null, [Validators.required, Validators.pattern("[A-Za-z0-9._%+-]{2,}@[a-zA-Z]{2,}([.]{1}[a-zA-Z]{2,}|[.]{1}[a-zA-Z]{2,}[.]{1}[a-zA-Z]{2,})")]),
      password: new FormControl(null, [Validators.required, Validators.minLength(6)]),
    });

    this.form.controls["email"].valueChanges.subscribe(res => {
      if (res) {
        this.form.markAsDirty();
        this.form.markAsTouched();
        this.form.updateValueAndValidity();
      }
    })
  }

  //============================================================================================
  ngOnInit() {
    localStorage.setItem("token",null);
    this.store.dispatch(new GetDataCartAction());
  }


  Vklog() {
    this.oauth.logInVia(this.vkProvider).then((success:any) => {
      const vkData = {
        "email": success.email,
        "socialToken": success.access_token,
        "socialType": "vk",
      };

      this.http.post(this.config.url + "auth/login", vkData).subscribe((data: any) => {
        this.response = data;
        this.shared.userInfo(this.response.result);
        this.dismiss();
      },
      err => {

      });
  }, (error) => {
      this.alert.show(error);
  });
  }


  facebookLogin() {
    this.fb.getLoginStatus().then((res: any) => {
      if (res.status == "connected") {
        this.createAccount(res.authResponse.accessToken, "fb");
      }
      else {
        this.fb.login(["public_profile", "user_friends", "email"])
          .then((res: FacebookLoginResponse) => {
            this.createAccount(res.authResponse.accessToken, "fb");
          })
          .catch(e => this.alert.show("Error logging into Facebook" + JSON.stringify(e)));
      }
    }).catch(e => this.alert.show("Error Check Login Status Facebook" + JSON.stringify(e)));
  }


  login() {
    this.postAuth(this.form.value);
  }

  openSignUpPage() {
    let modal = this.modalCtrl.create(SignUpPage);
    modal.present();
    this.dismiss();
  }

  openForgetPasswordPage() {
    let modal = this.modalCtrl.create(ForgotPasswordPage);
    modal.present();
  }

  googleLogin() {
    this.googlePlus.login({})
      .then(res => {
        this.createAccount(res, "google");
      })
      .catch(err => this.alert.show(JSON.stringify(err)));
  }


  //creating new account using function facebook or google details
  createAccount(info, type) {

    const socialData = {
      "socialToken": info,
      "socialType": "fb"
    };

    this.http.post(this.config.url + "auth/login/", socialData).subscribe((data: any) => {

      this.shared.userInfo(data);

      this.response = data;

      if(this.response.result.error == 0){
        this.shared.userInfo(this.response.result);
        this.dismiss();
      }

      if(this.response.result.error == 1){
        this.alert.show(this.response.result.errorText);
      }
    },
    err => {
      this.alert.show(err);
    });
  };


  //close modal
  logout() {
    this.fb.logout();
    localStorage.set('customerData', '');
    localStorage.set('x-content-session', '');
    this.store.dispatch(new GetDataCartAction());
  }


  dismiss() {
    this.viewCtrl.dismiss();
    this.menuCtrl.close();
  }

  postAuth(formData) {
    this.http.post(this.config.url + "auth/login/", formData).subscribe((data: any) => {

        localStorage.setItem("customerData", data.result.accessToken);
        this.store.dispatch(new GetDataCartAction());
        this.shared.userInfo(data);

        this.response = data;
        this.shared.userInfo(this.response.result);

        this.dismiss();
      },
      err => {

        if(err.status = 422){
          this.alert.show("Неверный лоигн или пароль. Попробуйте еще раз!");
        }
      });
  }

}
