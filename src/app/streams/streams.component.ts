import { Component, OnInit } from '@angular/core';
import { StreamService } from '../stream.service';
import { Stream } from '../stream';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  template : `
  <div *ngFor="let streamData of streams" class="sensor s4" (click)="play(streamData)">
      <div class="value">{{streamData.friendly}}</div>
      <div class="label">{{streamData.tv}}</div>
  </div>
  `,
  providers : [StreamService]
})

export class StreamsComponent implements OnInit {
  streams : Stream[];
  errorMessage : any;
  sub : any;
  constructor (
    private streamService : StreamService,
    private route : ActivatedRoute,
    private router : Router) {}

  ngOnInit() {

    this.sub = this.route.queryParams.subscribe(params => {
      let device = params['device'];
      this.streamService.getStreams(device || 'audio')
        .subscribe(
            streams => this.handledata(streams),
            error => this.errorMessage = error);
        });
  }

  handledata(st : any) {
      this.streams = st;
  }

  ngOnDestroy() {
    this.sub.unsubscribe();
  }

  play(streamData: Stream) {
    let x : any;
     if (streamData.media == 'audio/mp3') {
         x = this.streamService.playStream(streamData, 'audio');
     } else {
         x = this.streamService.playStream(streamData, 'video');
     }

     x.then(() => {
         console.log("playing " + streamData.friendly );
         this.router.navigateByUrl("/dashboard");
     });
  }
}
