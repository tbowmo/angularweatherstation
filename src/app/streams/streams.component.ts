import { Component, OnInit, OnDestroy } from '@angular/core';
import { ChromeCastService } from '../chrome-cast.service';
import { ChromeCastStream } from '../chrome-cast-stream';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  template: `
  <div *ngFor="let streamData of streams" class="sensor s4" (click)="play(streamData)">
      <div class="value">{{streamData.friendly}}</div>
      <div class="label">{{streamData.tv | truncate : 25: '.-.'}}</div>
  </div>
  `,
  providers: [ChromeCastService]
})

export class StreamsComponent implements OnInit, OnDestroy {
  streams: ChromeCastStream[];
  errorMessage: any;
  sub: any;
  private device: string;

  constructor (
    private streamService: ChromeCastService,
    private route: ActivatedRoute,
    private router: Router) {}

  ngOnInit() {

    this.sub = this.route.params.subscribe(params => {
      this.device = params['device'];

      this.streamService.getStreams(this.device || 'audio')
        .subscribe(
            streams => this.handledata(streams),
            error => this.errorMessage = error);
        });
  }

  handledata(st: any) {
      this.streams = st;
  }

  ngOnDestroy() {
    this.sub.unsubscribe();
  }

  play(streamData: ChromeCastStream) {

    this.streamService.playStream(streamData, this.device)
      .then(() => {
         console.log('playing ' + streamData.friendly );
         this.router.navigateByUrl('/dashboard');
       });
  }
}
