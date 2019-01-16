import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { HealthCatalogPage } from './health-catalog';

@NgModule({
  declarations: [
    HealthCatalogPage,
  ],
  imports: [
    IonicPageModule.forChild(HealthCatalogPage),
  ],
})
export class HealthCatalogPageModule {}
