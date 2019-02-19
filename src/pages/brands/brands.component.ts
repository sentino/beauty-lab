import { Component } from '@angular/core';


@Component({
  selector: 'brands-component',
  template: `
    <main>
      <div class="l-filted-list">

        <div class="c-param c-param--vertical">
          <h2 class="c-param__title c-param__title--vertical">1</h2>
          <div class="l-param__items l-param__items--vertical">
            <span class="c-param__text c-param__text--vertical">1-2DRY</span>
          </div>
        </div>

        <div class="c-param c-param--vertical">
          <h2 class="c-param__title c-param__title--vertical">3</h2>
          <div class="l-param__items l-param__items--vertical">
            <span class="c-param__text c-param__text--vertical">32 Бионорма</span>
          </div>
        </div>

        <div class="c-param c-param--vertical">
          <h2 class="c-param__title c-param__title--vertical">A</h2>
          <div class="l-param__items l-param__items--vertical">
            <span class="c-param__text c-param__text--vertical">A-Derma</span>
          </div>
        </div>

      </div>
    </main>
  `
})

export class BrandsComponent {

}
