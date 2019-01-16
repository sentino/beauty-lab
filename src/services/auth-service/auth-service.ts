// import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Storage } from '@ionic/storage';

// Import Auth0Cordova and auth0.js
import Auth0Cordova from '@auth0/cordova';
import * as auth0 from 'auth0-js';

const AUTH_CONFIG = {
  // Needed for Auth0 (capitalization: ID):
  clientID: 'AuwAz1lnk3kN4afCrHy5DWljywp3ZxOX',
  // Needed for Auth0Cordova (capitalization: Id):
  clientId: 'AuwAz1lnk3kN4afCrHy5DWljywp3ZxOX',
  domain: 'beaaty.auth0.com',
  packageIdentifier: 'com.kitapp.beauty_lab' // config.xml widget ID
};


/*
  Generated class for the AuthServiceProvider provider.

  See https://angular.io/guide/dependency-injection for more info on services
  and Angular DI.
*/
@Injectable()
export class AuthServiceProvider {

  Auth0 = new auth0.WebAuth(AUTH_CONFIG);
  Client = new Auth0Cordova(AUTH_CONFIG);
  accessToken: string;
  user: any;
  loggedIn: boolean;
  loading = true;
  zone;

  constructor(private storage: Storage) {
    console.log('Hello AuthServiceProvider Provider');


  }

  login_vk() {
    this.loading = true;
    const options = {
      scope: 'openid profile offline_access'
    };
    // Authorize login request with Auth0: open login page and get auth results
    this.Client.authorize(options, (err, authResult) => {
      if (err) {
        throw err;
      }
      // Set Access Token
      this.storage.set('access_token', authResult.accessToken);
      this.accessToken = authResult.accessToken;
      // Set Access Token expiration
      const expiresAt = JSON.stringify((authResult.expiresIn * 1000) + new Date().getTime());
      this.storage.set('expires_at', expiresAt);
      // Set logged in
      this.loading = false;
      this.loggedIn = true;
      // Fetch user's profile info
      this.Auth0.client.userInfo(this.accessToken, (err, profile) => {
        if (err) {
          throw err;
        }
        this.storage.set('profile', profile).then(val =>
          this.zone.run(() => this.user = profile)
        );
      });
    });
  }

  logout_vk() {
    this.storage.remove('profile');
    this.storage.remove('access_token');
    this.storage.remove('expires_at');
    this.accessToken = null;
    this.user = null;
    this.loggedIn = false;
  }

}
