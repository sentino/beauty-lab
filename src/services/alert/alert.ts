import { Injectable } from '@angular/core';
import { AlertController } from 'ionic-angular';



@Injectable()
export class AlertProvider {
  okText = "ok";
  alertText = "";

  constructor(
    public alertCtrl: AlertController,
  ) { }

  show(text) {
    let alert = this.alertCtrl.create({
      title: this.alertText,
      subTitle: text,
      buttons: [this.okText]
    });
    alert.present();
  }

  showWithTitle(text, title) {
    let alert = this.alertCtrl.create({
      title: title,
      subTitle: text,
      buttons: [this.okText]
    });
    alert.present();
  }
}
