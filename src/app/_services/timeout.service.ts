import { Injectable } from '@angular/core';
import { Subscription, timer } from 'rxjs';
import { Router } from '@angular/router';

@Injectable()
export class TimeoutService {
  private timer;
  private sub: Subscription;

  constructor(private router: Router) { }

  SetTimeout() {
    if (this.sub) {
      this.sub.unsubscribe();
      this.sub = null;
    }
    this.timer = timer(20000);
    this.sub = this.timer.subscribe(() => this.tickerFunc());
  }

  private tickerFunc() {
    this.router.navigate(['dashboard']);
    this.sub.unsubscribe();
    this.timer = null;
    this.sub = null;
  }

  ResetTimeout() {
    this.DisableTimeout();
    this.SetTimeout();
  }

  DisableTimeout() {
    if (this.sub) {
      this.sub.unsubscribe();
      this.timer = null;
      this.sub = null;
    }
  }
}
