import { Directive, HostListener } from '@angular/core';
declare let require: any;
const screenfull = require('screenfull');

@Directive({
  selector: '[toggleFullScreen]'
})
export class ToggleFullScreenDirective {
  @HostListener('click') onclick() {
    if (screenfull.enabled) {
      screenfull.toggle();
    }
  }
  constructor() { }
}
