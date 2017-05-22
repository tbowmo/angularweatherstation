import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { MenuLink } from './menu-link';
import { Router } from '@angular/router';
import * as moment from 'moment';
import "moment/locale/da";
declare const require: any;
const screenfull = require('screenfull');

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html'
})
export class AppComponent implements OnInit {
  ticks = 0;
  time = '00:00';
  date = '00:00';
  menuLinks: MenuLink[];
  showfullscreen = true;
  constructor(private router: Router) {}

  ngOnInit() {
    this.menuLinks = [
      {label: 'Hjem', target: ['dashboard'], css: 'ctive'},
      {label: 'Radio', target : ['streams', 'audio'], css: ''},
      {label: 'TV', target: ['streams', 'video'], css: ''},
      {label: 'Scene', target: ['scene'], css: ''},
      {label: 'Huset', target: ['house'], css: ''},
      {label: '', target: [''], css: ''},
    ];
    moment().locale("dk");
    this.time = moment().format("HH:mm");
    this.date = moment().format("MMMM Do YYYY");
    const timer = Observable.timer(0, 1000);
    timer.subscribe(() => {
      this.time = moment().format("HH:mm");
      this.date = moment().format("dddd Do MMMM - YYYY");
    });
  }

  gofullscreen() {
    this.showfullscreen = false;
    screenfull.toggle();
  }
  switchRoute(menu: MenuLink) {
    this.router.navigate(menu.target);
  }
}
