import { Component } from '@angular/core';
import { NavController } from 'ionic-angular';
import { HomePage } from '../../pages/home/home';
import { SharedDataProvider } from '../../services/shared-data/shared-data';
import { SettingsPage } from '../../pages/settings/settings';
import { ProductsPage } from '../../pages/products/products';
import { ConfigProvider } from '../../services/config/config';
import { Categories3Page } from '../../pages/categories3/categories3';
import { BeautyCatalogPage } from '../../pages/beauty-catalog/beauty-catalog';
import { HealthCatalogPage } from '../../pages/health-catalog/health-catalog';
import { ArticlesPromotionsContainer } from '../../pages/articles-promotions/articles-promotions-container';



@Component({
  selector: 'footer',
  templateUrl: 'footer.html'
})
export class FooterComponent {
  segments: any = 'HomePage';
  constructor(
    public navCtrl: NavController,
    public shared: SharedDataProvider,
    public config: ConfigProvider,
  ) {
    this.segments = shared.selectedFooterPage;
  }
  openPage(page) {
    this.shared.selectedFooterPage = page;

    if (page == "HomePage") { this.openHomePage(); }
    else if (page == "CategoriesPage") { this.openCategoryPage(); }
    else if (page == "ProductsPage") { this.navCtrl.push(ProductsPage); }
    else if (page == "articles") { this.navCtrl.setRoot(ArticlesPromotionsContainer, {type: 'articles'}) }
    else if (page == "SettingsPage") { this.navCtrl.setRoot(SettingsPage); }
  }
  openHomePage() {
    if (this.config.homePage == 1) { this.navCtrl.setRoot(HomePage); }
  }

  openBeautyCatalog(page){
    this.shared.selectedFooterPage = page;
    this.navCtrl.setRoot(BeautyCatalogPage);
  }

  openHealthCatalog(page){
    this.shared.selectedFooterPage = page;
    this.navCtrl.setRoot(HealthCatalogPage);
  }

  openCategoryPage() {
    if (this.config.categoryPage == 3) { this.navCtrl.setRoot(Categories3Page); }
  }
}
