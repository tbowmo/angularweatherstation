import { Component, OnInit } from '@angular/core';
import { Observable, timer } from 'rxjs';
import { MenuLink } from './_models';
import { Router } from '@angular/router';
import * as moment from 'moment';
import 'moment/locale/da';
import { TimeoutService } from './_services';

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
  constructor(
    private router: Router,
    private timeout: TimeoutService) {}

  ngOnInit() {
    this.menuLinks = [
      {label: 'Hjem', target: ['dashboard'], css: 'ctive'},
      {label: 'Radio', target : ['streams', 'audio'], css: ''},
      {label: 'TV', target: ['streams', 'video'], css: ''},
      {label: 'Scene', target: ['scene'], css: ''},
      {label: 'Huset', target: ['house'], css: ''},
      {label: 'Lys', target: ['lights'], css: ''},
    ];
    moment().locale('dk');
    this.time = moment().format('HH:mm');
    this.date = moment().format('MMMM Do YYYY');
    timer(0, 1000).subscribe(() => {
      this.time = moment().format('HH:mm');
      this.date = moment().format('dddd Do MMMM - YYYY');
    });
  }

  gofullscreen() {
    this.showfullscreen = false;
    screenfull.toggle();
  }
  switchRoute(menu: MenuLink) {
    this.timeout.SetTimeout();
    this.router.navigate(menu.target);
  }
}
