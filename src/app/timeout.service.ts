import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { Subscription } from 'rxjs/Subscription';
import { Router } from '@angular/router';

@Injectable()
export class TimeoutService {
  private timer;
  private sub: Subscription;

  constructor(private router: Router) { }

  SetTimeout() {
    console.log(this.sub);
    if (this.sub) {
      this.sub.unsubscribe();
      this.sub = null;
    }
    this.timer = Observable.timer(10000);
//    }

    this.sub = this.timer.subscribe(t => this.tickerFunc(t) );
  }

  private tickerFunc(tick) {
    this.router.navigate(['dashboard']);
    this.sub.unsubscribe();
    this.timer = null;
    this.sub = null;
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
