import { Component, OnInit, OnDestroy } from '@angular/core';
import { ChromeCastStatus } from '../chrome-cast-status';
import { ChromeCastService } from '../chrome-cast.service';
import { Observable, Subscription } from 'rxjs/Rx';

@Component({
  selector: 'app-chromestate',
  templateUrl: './chrome-state.component.html'
})

export class ChromeStateComponent implements OnInit, OnDestroy {
  errorMessage: any;
  subscribeStream: Subscription;
  chromeStatus: ChromeCastStatus;
  tidalTick = 0;
  title: string = "";
  device: string = "";
  private timer;
  // Subscription object
  private sub: Subscription;


  constructor(private streamService: ChromeCastService ) {}

  ngOnInit() {
      this.title = "";
      this.device = "";
      this.timer = Observable.timer(2000,5000);
      // subscribing to a observable returns a subscription object
      this.sub = this.timer.subscribe(t => this.tickerFunc(t));
      this.chromeStatus = new ChromeCastStatus();
      this.subscribeStream = this.streamService.getStatus().subscribe(state => this.handleState(state), error => this.errorMessage);
  }

  tickerFunc(tick){
    if (this.chromeStatus !== undefined) {
      if (this.chromeStatus.chromeApp ===  "TIDAL") {
        this.tidalTicker();
      }
    }
  }

  private tidalTicker() {
    this.tidalTick++;
    switch(this.tidalTick) {
      case 1:
        this.title = this.chromeStatus.title;
        this.device = "TIDAL Title";
        break;
      case 2:
        this.title = this.chromeStatus.artist;
        this.device = "TIDAL Artist";
        break;
      case 3:
        this.title = this.chromeStatus.album;
        this.device = "TIDAL Album";
        this.tidalTick = 0;
        break;
    }
  }

  handleState(state: ChromeCastStatus) {
    if (state.chromeApp !== 'None' && state.chromeApp !== 'Backdrop') {
      this.chromeStatus = state;
    } else {
      this.chromeStatus.chromeApp = '';
      this.chromeStatus.title = '';
    }
    if (this.chromeStatus.chromeApp === "TIDAL") {
      this.tidalTick = 0;
      this.tidalTicker();
    } else {
      this.device = this.chromeStatus.chromeApp;
      this.title = this.chromeStatus.title;
    }
  }

  ngOnDestroy() {
    this.subscribeStream.unsubscribe();
    this.sub.unsubscribe();
  }
}
