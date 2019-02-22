import { Component, EventEmitter, Input, Output } from '@angular/core';


@Component({
  selector: 'substances-component',
  template: `
    <div class="c-filter">
      <div class="l-filter__row" style="padding-left: 25px;">
        <div class="l-filter__buttons">
          <button class="c-filter__button" (click)="rusFilters = !rusFilters">А-Я</button>
          <button class="c-filter__button" (click)="engFilters = !engFilters">A-Z</button>
          <button class="c-filter__button" (click)="numbFilters = !numbFilters">0-9</button>
        </div>
        <div class="c-mode">
          <button class="c-mode__button c-mode__button--list"></button>
        </div>
      </div>
      
      <section 
        [style.display]="rusFilters ? 'block' : 'none'" 
        style="background-color: rgba(50,50,50,0.50); height: 100vh; width: 100%; top: 0; position: absolute;"
        (click)="rusFilters = false"></section>
      <div [ngClass]="rusFilters ? 'l-filter__row l-filter__row--active' : 'l-filter__row l-filter__row--unactive'">
        <div class="c-filter__dropdown" style="padding-right: 16px;
                                              padding-left: 30px;">
          <div class="l-filter-items__row">
            <span class="c-filter__item--modal" (click)="filterParams('А')">А</span>
            <span class="c-filter__item--modal" (click)="filterParams('Б')">Б</span>
            <span class="c-filter__item--modal" (click)="filterParams('В')">В</span>
            <span class="c-filter__item--modal" (click)="filterParams('Г')">Г</span>
            <span class="c-filter__item--modal" (click)="filterParams('Д')">Д</span>
            <span class="c-filter__item--modal" (click)="filterParams('Е')">Е</span>
            <span class="c-filter__item--modal" (click)="filterParams('Ж')">Ж</span>
          </div>
          <div class="l-filter-items__row">
            <span class="c-filter__item--modal" (click)="filterParams('З')">З</span>
            <span class="c-filter__item--modal" (click)="filterParams('И')">И</span>
            <span class="c-filter__item--modal" (click)="filterParams('К')">К</span>
            <span class="c-filter__item--modal" (click)="filterParams('Л')">Л</span>
            <span class="c-filter__item--modal" (click)="filterParams('М')">М</span>
            <span class="c-filter__item--modal" (click)="filterParams('Н')">Н</span>
            <span class="c-filter__item--modal" (click)="filterParams('О')">О</span>
          </div>
          <div class="l-filter-items__row">
            <span class="c-filter__item--modal" (click)="filterParams('П')">П</span>
            <span class="c-filter__item--modal" (click)="filterParams('Р')">Р</span>
            <span class="c-filter__item--modal" (click)="filterParams('С')">С</span>
            <span class="c-filter__item--modal" (click)="filterParams('Т')">Т</span>
            <span class="c-filter__item--modal" (click)="filterParams('У')">У</span>
            <span class="c-filter__item--modal" (click)="filterParams('Ф')">Ф</span>
            <span class="c-filter__item--modal" (click)="filterParams('Х')">Х</span>
          </div>
          <div class="l-filter-items__row">
            <span class="c-filter__item--modal" (click)="filterParams('Ц')">Ц</span>
            <span class="c-filter__item--modal" (click)="filterParams('Ч')">Ч</span>
            <span class="c-filter__item--modal" (click)="filterParams('Ш')">Ш</span>
            <span class="c-filter__item--modal" (click)="filterParams('Щ')">Щ</span>
            <span class="c-filter__item--modal" (click)="filterParams('Э')">Э</span>
            <span class="c-filter__item--modal" (click)="filterParams('Ю')">Ю</span>
            <span class="c-filter__item--modal" (click)="filterParams('Я')">Я</span>
          </div>
        </div>
      </div>


      <section
        [style.display]="engFilters ? 'block' : 'none'"
        style="background-color: rgba(50,50,50,0.50); height: 100vh; width: 100%; top: 0; position: absolute;"
        (click)="engFilters = false"></section>
      <div [ngClass]="engFilters ? 'l-filter__row l-filter__row--active' : 'l-filter__row l-filter__row--unactive'">
        <div class="c-filter__dropdown" style="padding-right: 16px;
                                              padding-left: 30px;">
          <div class="l-filter-items__row">
            <span class="c-filter__item--modal" (click)="filterParams('A')">A</span>
            <span class="c-filter__item--modal" (click)="filterParams('B')">B</span>
            <span class="c-filter__item--modal" (click)="filterParams('C')">C</span>
            <span class="c-filter__item--modal" (click)="filterParams('D')">D</span>
            <span class="c-filter__item--modal" (click)="filterParams('E')">E</span>
            <span class="c-filter__item--modal" (click)="filterParams('F')">F</span>
            <span class="c-filter__item--modal" (click)="filterParams('G')">G</span>
          </div>
          <div class="l-filter-items__row">
            <span class="c-filter__item--modal" (click)="filterParams('H')">H</span>
            <span class="c-filter__item--modal" (click)="filterParams('I')">I</span>
            <span class="c-filter__item--modal" (click)="filterParams('J')">J</span>
            <span class="c-filter__item--modal" (click)="filterParams('K')">K</span>
            <span class="c-filter__item--modal" (click)="filterParams('L')">L</span>
            <span class="c-filter__item--modal" (click)="filterParams('M')">M</span>
            <span class="c-filter__item--modal" (click)="filterParams('N')">N</span>
          </div>
          <div class="l-filter-items__row">
            <span class="c-filter__item--modal" (click)="filterParams('O')">O</span>
            <span class="c-filter__item--modal" (click)="filterParams('P')">P</span>
            <span class="c-filter__item--modal" (click)="filterParams('Q')">Q</span>
            <span class="c-filter__item--modal" (click)="filterParams('R')">R</span>
            <span class="c-filter__item--modal" (click)="filterParams('S')">S</span>
            <span class="c-filter__item--modal" (click)="filterParams('T')">T</span>
            <span class="c-filter__item--modal" (click)="filterParams('U')">U</span>
          </div>
          <div class="l-filter-items__row">
            <span class="c-filter__item--modal" (click)="filterParams('V')">V</span>
            <span class="c-filter__item--modal" (click)="filterParams('W')">W</span>
            <span class="c-filter__item--modal" (click)="filterParams('X')">X</span>
            <span class="c-filter__item--modal" (click)="filterParams('Y')">Y</span>
            <span class="c-filter__item--modal" (click)="filterParams('Z')">Z</span>
            <span class="c-filter__item--modal">&nbsp;</span>
            <span class="c-filter__item--modal">&nbsp;</span>
          </div>
        </div>
      </div>


      <section
        [style.display]="numbFilters ? 'block' : 'none'"
        style="background-color: rgba(50,50,50,0.50); height: 100vh; width: 100%; top: 0; position: absolute;"
        (click)="numbFilters = false"></section>
      <div [ngClass]="numbFilters ? 'l-filter__row l-filter__row--active' : 'l-filter__row l-filter__row--unactive'">
        <div class="c-filter__dropdown" style="padding-right: 16px;
                                              padding-left: 30px;">
          <div class="l-filter-items__row">
            <span class="c-filter__item--modal" (click)="filterParams('0')">0</span>
            <span class="c-filter__item--modal" (click)="filterParams('1')">1</span>
            <span class="c-filter__item--modal" (click)="filterParams('2')">2</span>
            <span class="c-filter__item--modal" (click)="filterParams('3')">3</span>
            <span class="c-filter__item--modal" (click)="filterParams('4')">4</span>
            <span class="c-filter__item--modal" (click)="filterParams('5')">5</span>
            <span class="c-filter__item--modal" (click)="filterParams('6')">6</span>
          </div>
          <div class="l-filter-items__row">
            <span class="c-filter__item--modal" (click)="filterParams('7')">7</span>
            <span class="c-filter__item--modal" (click)="filterParams('8')">8</span>
            <span class="c-filter__item--modal" (click)="filterParams('9')">9</span>
            <span class="c-filter__item--modal">&nbsp;</span>
            <span class="c-filter__item--modal">&nbsp;</span>
            <span class="c-filter__item--modal">&nbsp;</span>
            <span class="c-filter__item--modal">&nbsp;</span>
          </div>
        </div>
      </div>
    </div>

    <main style="margin-top: 25px; padding-left: 25px; padding-right: 16px;">
      <div class="l-filted-list" *ngIf="result.length">

        <div class="c-param c-param--vertical" *ngFor="let item of result">
          <h2 class="c-param__title c-param__title--vertical" style="margin-top: 0">{{item.category}}</h2>
          <div class="l-param__items l-param__items--vertical">
            <span class="c-param__text c-param__text--vertical" *ngFor="let subItem of item.brandItems"
                  (click)="brand(subItem.id)">{{subItem.name}}</span>
          </div>
        </div>

      </div>
    </main>
  `
})

export class SubstancesComponent {
  @Input() result;

  @Output() goToBrand: EventEmitter<any> = new EventEmitter<any>();
  @Output() filterArray: EventEmitter<any> = new EventEmitter<any>();

  rusFilters = false;
  engFilters = false;
  numbFilters = false;

  brand(id) {
    this.goToBrand.emit(id);
  }

  filterParams(param) {
    this.filterArray.emit(param);
    this.rusFilters = false;
    this.engFilters = false;
    this.numbFilters = false;
  }
}
