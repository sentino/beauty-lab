import { Directive, HostListener, Input } from '@angular/core';

@Directive({
  // tslint:disable-next-line:directive-selector
  selector : '[href]'
})
export class HrefDirective {
  @Input() public href: string | undefined;

  @HostListener('click', ['$event']) public onClick(event: Event): void {
    if (!this.href || this.href === '#' || (this.href && this.href.length === 0)) {
      event.preventDefault();
    }
  }
}
