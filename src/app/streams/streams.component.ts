import { Component, OnInit, OnDestroy } from '@angular/core';
import { ChromeCastService } from '../chrome-cast.service';
import { ChromeCastStream } from '../chrome-cast-stream';
import { ActivatedRoute, Router } from '@angular/router';
import { ChromeCastStatus } from '../chrome-cast-status';
import { Subscription } from 'rxjs/Subscription';
@Component({
  template: `
  <div *ngFor="let streamData of streams" class="sensor s4" (click)="play(streamData)">
      <div class="value" [class.grey]="(status.id !== streamData.id)">{{streamData.friendly}}</div>
      <div class="label">{{streamData.tv | truncate : 30 }}</div>
  </div>
  `,
  styles: ['.grey {color:grey;}']
})

export class StreamsComponent implements OnInit, OnDestroy {
  streams: ChromeCastStream[];
  errorMessage: any;
  routeSub: Subscription;
  statusSub: Subscription;
  streamSub: Subscription;
  status: ChromeCastStatus;
  private device: string;

  constructor (
    private streamService: ChromeCastService,
    private route: ActivatedRoute,
    private router: Router) {}

  ngOnInit() {

    this.routeSub = this.route.params.subscribe(params => {

      this.device = params['device'];

      this.statusSub = this.streamService.getStatus()
        .subscribe(
          (result) => { this.status = result; }
        );

      this.streamSub = this.streamService.getStreams(this.device || 'audio')
        .subscribe(
            (streams) => { this.streams = streams; },
            error => this.errorMessage = error);
    });

  }

  ngOnDestroy() {
    this.routeSub.unsubscribe();
    this.statusSub.unsubscribe();
    this.streamSub.unsubscribe();
  }

  play(streamData: ChromeCastStream) {

    this.streamService.playStream(streamData, this.device)
      .then(() => {
         console.log('playing ' + streamData.friendly );
         this.router.navigateByUrl('/dashboard');
       });
  }
}
