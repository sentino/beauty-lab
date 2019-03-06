import { Pipe, PipeTransform } from '@angular/core';
import { ConfigProvider } from '../../services/config/config';


@Pipe({
  name: 'curency',
})
export class CurencyPipe implements PipeTransform {

  constructor(public c: ConfigProvider) {
  }

  transform(value) {

    var v = parseInt(value);
    if (v.toString() == 'NaN') {

      if (this.c.currencyPos == 'left')
        return this.c.currency + " " + value;
      else
        return value + " " + this.c.currency;
    }
    else {
      if (this.c.currencyPos == 'left')
        return this.c.currency + " " + parseInt(value);
      else
        return parseInt(value) + " " + this.c.currency;
    }
  }
}
