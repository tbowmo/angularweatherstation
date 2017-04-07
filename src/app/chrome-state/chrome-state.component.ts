import { Component, OnInit } from '@angular/core';
import { ChromeStatus } from '../chrome-status';
import { StreamService } from '../stream.service';
@Component({
  selector: 'chromestate',
  templateUrl: './chrome-state.component.html',
  styleUrls: ['./chrome-state.component.css'],
  providers: [StreamService]
})
export class ChromeStateComponent implements OnInit {
  errorMessage: any;
  artist: string;
  title: string;
  constructor(private streamService: StreamService ) {}

  ngOnInit() {
      this.streamService.getStatus('video').subscribe(state => this.handleState(state), error => this.errorMessage);
  }

  handleState(state: ChromeStatus) {
      this.title = state.title;
      this.artist = state.chromeApp;
  }
}
