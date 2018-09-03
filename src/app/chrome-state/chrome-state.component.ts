import { Component, OnInit, OnDestroy } from '@angular/core';
import { ChromeCastStatus } from '../_models';
import { Subscription, timer } from 'rxjs';
import { MqttService } from 'ngx-mqtt';

@Component({
  selector: 'app-chromestate',
  templateUrl: './chrome-state.component.html'
})

export class ChromeStateComponent implements OnInit, OnDestroy {
  errorMessage: any;
  subscribeStream: Subscription;
  chromeStatus: ChromeCastStatus;
  tidalTick = 0;
  title = '';
  device = '';
  private timer;
  // Subscription object
  private sub: Subscription;


  constructor (private mqtt: MqttService) {
    mqtt.onError.subscribe((e) => console.log('onError', e));
  }

  ngOnInit() {
      this.timer = timer(2000, 5000);
      // subscribing to a observable returns a subscription object
      this.sub = this.timer.subscribe(() => this.tickerFunc());
      this.chromeStatus = new ChromeCastStatus();
      this.subscribeStream = this.mqtt.observe('chromecast/+/media').subscribe((data) => {
        const d = JSON.parse(data.payload.toString()) as ChromeCastStatus;
        this.handleState(d);
      });
    }

  tickerFunc() {
    if (this.chromeStatus !== undefined) {
      if (this.chromeStatus.chrome_app ===  'TIDAL') {
        this.tidalTicker();
      }
    }
  }

  private tidalTicker() {
    this.tidalTick++;
    switch (this.tidalTick) {
      case 1:
        this.title = this.chromeStatus.title;
        this.device = 'TIDAL Title';
        break;
      case 2:
        this.title = this.chromeStatus.artist;
        this.device = 'TIDAL Artist';
        break;
      case 3:
        this.title = this.chromeStatus.album;
        this.device = 'TIDAL Album';
        this.tidalTick = 0;
        break;
    }
  }

  handleState(state: ChromeCastStatus) {
    if (state.chrome_app !== 'None' && state.chrome_app !== 'Backdrop') {
      this.chromeStatus = state;
    } else {
      this.chromeStatus.chrome_app = '';
      this.chromeStatus.title = '';
    }
    console.log(this.chromeStatus);
    if (this.chromeStatus.chrome_app === 'TIDAL') {
      this.tidalTick = 0;
      this.tidalTicker();
    } else {
      this.device = this.chromeStatus.chrome_app;
      this.title = this.chromeStatus.title;
    }
  }

  ngOnDestroy() {
    this.subscribeStream.unsubscribe();
    this.sub.unsubscribe();
  }
}
