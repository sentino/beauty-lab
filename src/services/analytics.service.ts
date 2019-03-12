import { Injectable } from '@angular/core';
import { GoogleAnalytics } from '@ionic-native/google-analytics/ngx';

@Injectable()
export class AnalyticsService {

  constructor(
    private googleAnalytics: GoogleAnalytics,
  ) {}

  trackPage(page) {
    this.googleAnalytics.startTrackerWithId('UA-136019689-1')
      .then(() => {
        console.log('Google analytics is ready now');
        this.googleAnalytics.trackView(page);
        // Tracker is ready
        // You can now track pages or set additional information such as AppVersion or UserId
      })
      .catch(e => console.log('Error starting GoogleAnalytics', e));
  }
}
