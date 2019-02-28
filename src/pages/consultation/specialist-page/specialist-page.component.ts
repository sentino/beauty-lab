import { Component } from '@angular/core';


@Component({
  selector: 'specialist-page-component',
  template: `
    <main>
      <section class="c-consultant">
        <img src="../../../assets/images/provizor.jpg" alt="#" class="c-consultant__image">
        <h2 class="c-consultant__name">Ирина Верина</h2>
        <div class="c-info">
          <div class="c-info__article">
            <span class="c-position">Консультант-провизор</span>
          </div>
          <div class="c-info__article">
            <span class="c-experience">Стаж работы:</span>
            <span class="c-experience__value">6 лет</span>
          </div>
          <div class="c-info__article">
            <span class="c-education">Образование:</span>
            <span class="c-education__value">высшее</span>
          </div>
          <div class="c-info__article">
            <span class="c-upgrading">Повышение квалификации:</span>
            <span class="c-upgrading__value">28 часов</span>
          </div>
        </div>
        <div class="c-personal-info">
          <h3 class="c-personal-info__title">О себе:</h3>
          <p class="c-personal-info__text">
            Lorem ipsum dolor sit amet, consectetuer adipiscing elit.
            Aenean commodo ligula eget dolor. Aenean massa. Cum sociis
            natoque penatibus et magnis dis parturient montes,
            nascetur ridiculus mus.
          </p>
        </div>
        <button class="c-primary-button c-primary-button--narrow">ЗАДАТЬ ВОПРОС</button>
        <div class="c-share">
          <h2 class="c-share__title">Поделиться в соц-сетях:</h2>
          <button class="c-share__button"></button>
        </div>
      </section>
    </main>
  `
})

export class SpecialistPageComponent {

}
