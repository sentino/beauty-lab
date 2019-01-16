import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { BeautyCatalogPage } from './beauty-catalog';

@NgModule({
  declarations: [
    BeautyCatalogPage,
  ],
  imports: [
    IonicPageModule.forChild(BeautyCatalogPage),
  ],
})
export class BeautyCatalogPageModule {}
