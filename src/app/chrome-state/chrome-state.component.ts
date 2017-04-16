import { Component, OnInit, OnDestroy } from '@angular/core';
import { ChromeCastStatus } from '../chrome-cast-status';
import { ChromeCastService } from '../chrome-cast.service';
import { Subscription } from 'rxjs/Subscription';

@Component({
  selector: 'app-chromestate',
  templateUrl: './chrome-state.component.html',
  styleUrls: ['./chrome-state.component.css']
})

export class ChromeStateComponent implements OnInit, OnDestroy {
  errorMessage: any;
  subscribeStream: Subscription;
  status: ChromeCastStatus;
  constructor(private streamService: ChromeCastService ) {}

  ngOnInit() {
      this.status = new ChromeCastStatus();
      this.subscribeStream = this.streamService.getStatus().subscribe(state => this.handleState(state), error => this.errorMessage);
  }

  handleState(state: ChromeCastStatus) {
    if (state.chromeApp !== 'None' && state.chromeApp !== 'Backdrop') {
      this.status = state;
    } else {
      this.status.chromeApp = '';
      this.status.title = '';
    }
  }

  ngOnDestroy() {
    this.subscribeStream.unsubscribe();
  }
}
