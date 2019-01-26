// Project Name: IonicEcommerce
// Project URI: http://ionicecommerce.com
// Author: VectorCoder Team
// Author URI: http://vectorcoder.com/
import { Component } from '@angular/core';
import { ViewController, ModalController } from 'ionic-angular';
import { SignUpPage } from '../sign-up/sign-up';
import { Http } from '@angular/http';
import { ConfigProvider } from '../../services/config/config';
import { LoadingProvider } from '../../services/loading/loading';
import { ForgotPasswordPage } from '../forgot-password/forgot-password';
import { SharedDataProvider } from '../../services/shared-data/shared-data';
import { Facebook, FacebookLoginResponse } from '@ionic-native/facebook/ngx';
import { AlertProvider } from '../../services/alert/alert';
import { GooglePlus } from '@ionic-native/google-plus/ngx';
import { AppVersion } from '@ionic-native/app-version/ngx';
import { MenuController } from 'ionic-angular';
import { App} from 'ionic-angular';
import { HomePage } from '../home/home';
import { Events } from 'ionic-angular';
import { InAppBrowser, InAppBrowserEvent } from '@ionic-native/in-app-browser/ngx';
import { LoginmodalPage } from '../loginmodal/loginmodal';
import { BsModalService } from 'ngx-bootstrap/modal';
import { BsModalRef } from 'ngx-bootstrap/modal/bs-modal-ref.service';
import { ViewChild } from '@angular/core';
import {VK} from "ng2-cordova-oauth/core";
import {OauthCordova} from 'ng2-cordova-oauth/platform/cordova';
import { NavController, Content } from 'ionic-angular';
import { HttpClient } from '@angular/common/http';


@Component({
  selector: 'page-login',
  templateUrl: 'login.html',

})
export class LoginPage {
  formData = { 
    email: '', 
    password: '', 
    socialToken: '',
    socialType: ''   
  };

  
  errorMessage = '';
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
    private googlePlus: GooglePlus
  ) {

  }

  Vklog(){
    this.oauth.logInVia(this.vkProvider).then((success:any) => {
      var VkData = new FormData();
      VkData.append('email', success.email);
      VkData.append('socialToken', success.access_token);
      VkData.append('socialType','vk');

      this.http.post(this.config.url + 'auth/login', VkData).subscribe((data: any) => {
        console.log(data);
        this.response = data;
        this.shared.userInfo(this.response.result);
        this.viewCtrl.dismiss();
        this.menuCtrl.close();
        this.appCtrl.getRootNav().setRoot(HomePage); 
      },
      err => {
        this.loading.hide();
        // alert("Whoops!");
        // alert(err);
        // alert(err.status);
        // console.log(err)
        // if(err.status = 422){
        //   alert("Были введены неправильные е-мейл или пароль.Попробуйте, ещё раз!")
        // }
      });
  }, (error) => {
      alert(error);
      console.log("VK Error");
      console.log(error);
  });
  }



  login() {
    this.loading.show();
    this.errorMessage = '';


    var LogData = new FormData();

    LogData.append('email', this.formData.email);
    LogData.append('password', this.formData.password);

    this.http.post(this.config.url + 'auth/login/', LogData).subscribe((data: any) => {
      this.loading.hide();
      console.log("User info login");
      console.log(data);
      this.shared.userInfo(data);

      this.response = data;

      console.log("Ошибок нету"); 
      this.shared.userInfo(this.response.result);
        
      this.viewCtrl.dismiss();
      this.appCtrl.getRootNav().setRoot(HomePage);
      this.menuCtrl.close();
    },
    err => {
      this.loading.hide();
      console.log(err)
      if(err.status = 422){
        alert("Были введены неправильные е-мейл или пароль. Попробуйте, ещё раз!")
      }
    });
  }

  loginVK(){
    console.log("Url parameters array");
    var url_link;
    var ref = window.open("https://oauth.vk.com/authorize?client_id=6410035&display=page&redirect_uri=https://oauth.vk.com/blank.html&scope=friends,offline,email&response_type=token&v=5.52','_blank", "_blank", "location=yes,clearcache=yes,clearsessioncache=yes");
    // attach listener to loadstart
    var url_link;
    var urlVar;
    var token;

    ref.addEventListener('loadstart', function(event: InAppBrowserEvent) { 
      url_link = event.url;
      urlVar = event.url;

      urlVar = urlVar.split('#')[1];

      var Params = urlVar.split('&');
      var sentToken = Params[0].split('=')[1];
      var sentEmail = Params[3].split('=')[1];

      localStorage.setItem("token", sentToken);
      localStorage.setItem("sentEmail", sentEmail);
      ref.close();
    });

    ref.addEventListener('exit', function(event: InAppBrowserEvent) { 
      if(localStorage.getItem('token') != 'null'){
        localStorage.setItem("vk_login",'true');
        alert("Пожалуйста подождите, происходит вход в приложение!");
        location.reload();
      }
    });

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

  facebookLogin() {
    this.fb.getLoginStatus().then((res: any) => {
      if (res.status == 'connected') {
        console.log("user connected already" + res.authResponse.accessToken);
        this.createAccount(res.authResponse.accessToken, 'fb');
      }
      else {
        console.log("USer Not login ");
        this.fb.login(['public_profile', 'user_friends', 'email'])
          .then((res: FacebookLoginResponse) => {
            // this.alert.show('Logged into Facebook!' + JSON.stringify(res));
            console.log("successfully login ");
            this.createAccount(res.authResponse.accessToken, 'fb');
          })
          .catch(e => this.alert.show('Error logging into Facebook' + JSON.stringify(e)));
      }
    }).catch(e => this.alert.show('Error Check Login Status Facebook' + JSON.stringify(e)));
  }

  googleLogin() {
    this.loading.autoHide(500);
    this.googlePlus.login({})
      .then(res => {
      //  alert(JSON.stringify(res))
        this.createAccount(res, 'google');
      })
      .catch(err => this.alert.show(JSON.stringify(err)));
  }
  //============================================================================================  
  //creating new account using function facebook or google details 
  createAccount(info, type) {
    // alert(info);
    this.loading.show();
    var data: { [k: string]: any } = {};
    var url = '';
    if (type == 'fb') {
      url = 'auth/login/';
      data.access_token = info;
    }
    else {
      url = 'googleRegistration';
      data = info;
    }
    var FbData = new FormData();

    FbData.append('socialToken',data.access_token);
    FbData.append('socialType','fb');
    
    this.http.post(this.config.url + 'auth/login/', FbData).subscribe((data: any) => {
      this.loading.hide();

      console.log("Face login");
      console.log(data);
      this.shared.userInfo(data);

      this.response = data;

      if(this.response.result.error == 0){
        console.log("Ошибок нету"); 
        this.shared.userInfo(this.response.result);
        
        this.viewCtrl.dismiss();
        this.appCtrl.getRootNav().setRoot(HomePage);
        this.menuCtrl.close();
      }

      if(this.response.result.error == 1){
        console.log("Ошибочки"); 
        console.log(this.response.result.errorText);
        alert(this.response.result.errorText);
      }
    },
    err => {
      alert("Ошибка");
      alert(err);
    });
  };
  //close modal
  logout() {
    this.fb.logout();
  }


  
  dismiss() {
    this.viewCtrl.dismiss();
    this.menuCtrl.close();
    this.appCtrl.getRootNav().setRoot(HomePage); 
  }

  ngOnInit() {
    localStorage.setItem("token",null);

    const FloatLabel = (() => {
      // add active class and placeholder 
      const handleFocus = (e) => {
        const target = e.target;
        target.parentNode.classList.add('active');
        target.setAttribute('placeholder', target.getAttribute('data-placeholder'));
      };
      
      // remove active class and placeholder
      const handleBlur = (e) => {
        const target = e.target;
        if(!target.value) {
          target.parentNode.classList.remove('active');
        }
        target.removeAttribute('placeholder');    
      };  
      
      // register events
      const bindEvents = (element) => {
        const floatField = element.querySelector('input');
        floatField.addEventListener('focus', handleFocus);
        floatField.addEventListener('blur', handleBlur);    
      };
      
      // get DOM elements
      const init = () => {
        const floatContainers  = Array.from(document.querySelectorAll('.float-container'));

        floatContainers.forEach((element) => {
          if (element.querySelector('input').value) {
              element.classList.add('active');
          }      
          
          bindEvents(element);
        });
      };
      
      return {
        init: init
      };
    })();
    
    FloatLabel.init();
    
  }

}
