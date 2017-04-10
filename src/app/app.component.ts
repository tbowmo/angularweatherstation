import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { MenuLink } from './menu-link';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  ticks = 0;
  time = '00:00';
  date = '00:00';
  menuLinks: MenuLink[];
  ngOnInit() {
    this.menuLinks = [
      {label: 'Hjem', target: 'dashboard', params: ''},
      {label: 'Radio', target : 'streams', params: {device: 'audio'}},
      {label: 'TV', target: 'streams', params: {device: 'video'}},
      {label: 'Scene', target:'scene', params:''},
      {label: '', target:'', params:''},
      {label: '', target:'', params:''},
    ];
    this.time = formatDate(new Date(), 'HH:mm');
    this.date = formatDate(new Date());
    const timer = Observable.timer(0, 1000);
    timer.subscribe(() => {
    });
  }
}

function formatDate(date: Date, format: string = 'dddd dd. MMMM yyyy', utc: Boolean = false) {
    const MMMM = ['\x00', 'Januar', 'Februar', 'Marts', 'April', 'Maj', 'Juni',
                          'Juli', 'August', 'September', 'Oktober', 'November', 'December'];
    const MMM = ['\x01', 'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    const dddd = ['\x02', 'Søndag', 'Mandag', 'Tirsdag', 'Onsdag', 'Torsdag', 'Fredag', 'Lørdag'];
    const ddd = ['\x03', 'Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

    function ii(i: number, len: number= 2) {
        let s = i + '';
        len = len || 2;
        while (s.length < len) {
          s = '0' + s;
        }
        return s;
    }

    const y = utc ? date.getUTCFullYear() : date.getFullYear();
    format = format.replace(/(^|[^\\])yyyy+/g, '$1' + y);
    format = format.replace(/(^|[^\\])yy/g, '$1' + y.toString().substr(2, 2));
    format = format.replace(/(^|[^\\])y/g, '$1' + y);

    const M = (utc ? date.getUTCMonth() : date.getMonth()) + 1;
    format = format.replace(/(^|[^\\])MMMM+/g, '$1' + MMMM[0]);
    format = format.replace(/(^|[^\\])MMM/g, '$1' + MMM[0]);
    format = format.replace(/(^|[^\\])MM/g, '$1' + ii(M));
    format = format.replace(/(^|[^\\])M/g, '$1' + M);

    const d = utc ? date.getUTCDate() : date.getDate();
    format = format.replace(/(^|[^\\])dddd+/g, '$1' + dddd[0]);
    format = format.replace(/(^|[^\\])ddd/g, '$1' + ddd[0]);
    format = format.replace(/(^|[^\\])dd/g, '$1' + ii(d));
    format = format.replace(/(^|[^\\])d/g, '$1' + d);

    const H = utc ? date.getUTCHours() : date.getHours();
    format = format.replace(/(^|[^\\])HH+/g, '$1' + ii(H));
    format = format.replace(/(^|[^\\])H/g, '$1' + H);

    const h = H > 12 ? H - 12 : H === 0 ? 12 : H;
    format = format.replace(/(^|[^\\])hh+/g, '$1' + ii(h));
    format = format.replace(/(^|[^\\])h/g, '$1' + h);

    const m = utc ? date.getUTCMinutes() : date.getMinutes();
    format = format.replace(/(^|[^\\])mm+/g, '$1' + ii(m));
    format = format.replace(/(^|[^\\])m/g, '$1' + m);

    const s = utc ? date.getUTCSeconds() : date.getSeconds();
    format = format.replace(/(^|[^\\])ss+/g, '$1' + ii(s));
    format = format.replace(/(^|[^\\])s/g, '$1' + s);

    let f = utc ? date.getUTCMilliseconds() : date.getMilliseconds();
    format = format.replace(/(^|[^\\])fff+/g, '$1' + ii(f, 3));
    f = Math.round(f / 10);
    format = format.replace(/(^|[^\\])ff/g, '$1' + ii(f));
    f = Math.round(f / 10);
    format = format.replace(/(^|[^\\])f/g, '$1' + f);

    const T = H < 12 ? 'AM' : 'PM';
    format = format.replace(/(^|[^\\])TT+/g, '$1' + T);
    format = format.replace(/(^|[^\\])T/g, '$1' + T.charAt(0));

    const t = T.toLowerCase();
    format = format.replace(/(^|[^\\])tt+/g, '$1' + t);
    format = format.replace(/(^|[^\\])t/g, '$1' + t.charAt(0));

    let tz = -date.getTimezoneOffset();
    let K = utc || !tz ? 'Z' : tz > 0 ? '+' : '-';
    if (!utc) {
        tz = Math.abs(tz);
        const tzHrs = Math.floor(tz / 60);
        const tzMin = tz % 60;
        K += ii(tzHrs) + ':' + ii(tzMin);
    }
    format = format.replace(/(^|[^\\])K/g, '$1' + K);

    const day = (utc ? date.getUTCDay() : date.getDay()) + 1;
    format = format.replace(new RegExp(dddd[0], 'g'), dddd[day]);
    format = format.replace(new RegExp(ddd[0], 'g'), ddd[day]);

    format = format.replace(new RegExp(MMMM[0], 'g'), MMMM[M]);
    format = format.replace(new RegExp(MMM[0], 'g'), MMM[M]);

    format = format.replace(/\\(.)/g, '$1');

    return format;
};
