import { ActivatedRoute, Router } from '@angular/router';
import { ChromeCastService, RemoteService } from '../_services';
import { ChromeCastStatus } from '../_models';
import { ChromeCastStream } from '../_models';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { Observable, Subscription } from 'rxjs/Rx';

@Component({
  template: `
  <div *ngFor="let streamData of streams | async" class="sensor s4" (click)="play(streamData)">
      <div class="value" [class.grey]="(status.id !== streamData.id)">{{streamData.friendly}}</div>
      <div class="label">{{streamData.tv | truncate : 30 }}</div>
  </div>
  `,
  styles: ['.grey {color:grey;}']
})

export class StreamsComponent implements OnInit, OnDestroy {
  streams: Observable<ChromeCastStream[]>;
  errorMessage: any;
  routeSub: Subscription;
  status: ChromeCastStatus;
  private device: string;

  constructor (
    private streamService: ChromeCastService,
    private route: ActivatedRoute,
    private remote: RemoteService,
    private router: Router) {}

  ngOnInit() {

    this.routeSub = this.route.params.subscribe(params => {

      this.device = params['device'];

      this.streamService.getStatus().first()
        .subscribe(
          (result) => { this.status = result; }
        );

      this.streams = this.remote.getStreams(this.device || 'audio');
    });

  }

  ngOnDestroy() {
    this.routeSub.unsubscribe();
  }

  play(streamData: ChromeCastStream) {

    this.remote.play(streamData);
    this.router.navigateByUrl('/dashboard');
  }
}
