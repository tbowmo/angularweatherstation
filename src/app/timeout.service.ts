import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { Subscription } from 'rxjs/Subscription';
import { Router } from '@angular/router';

@Injectable()
export class TimeoutService {

  constructor(private router: Router) { }
  private timer;
  private sub: Subscription;
  SetTimeout() {
    if (!this.timer) {
      this.timer = Observable.timer(10000);
    }
    this.sub = this.timer.subscribe(t => this.tickerFunc(t) );
  }

  private tickerFunc(tick) {
    this.router.navigate(['dashboard']);
    this.sub.unsubscribe();
    this.timer = null;
  }

  ResetTimeout() {

  }

  DisableTimeout() {
    if (this.sub) {
      this.sub.unsubscribe();
      this.timer = null;
      this.sub = null;
    }
  }
}
