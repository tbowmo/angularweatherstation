import { Component, OnInit } from '@angular/core';
import { Subscription} from 'rxjs/Subscription';
import { ActivatedRoute, Router } from '@angular/router';
import { RemoteService } from '../_services';
import { AVScene } from '../_models';
import { Observable } from 'rxjs/Rx';

@Component({
  selector: 'app-scene',
  template: `
  <div *ngFor="let sceneData of scenes| async" class="sensor s3" (click)="play(sceneData)">
      <div class="value {{sceneData.mqttName}}" >{{sceneData.name | truncateHead}}</div>
  </div>`
})

export class SceneComponent implements OnInit {
  scenes: Observable<AVScene[]>;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private remote: RemoteService
  ) {}

  ngOnInit() {
    this.scenes = this.remote.getAVScenes();
  }

  play(scene: AVScene) {
    this.remote.setAVState(scene);
  }
}
