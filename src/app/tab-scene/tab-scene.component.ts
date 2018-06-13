import { Component, OnInit, OnDestroy } from '@angular/core';
import { Subscription} from 'rxjs';
import { ActivatedRoute, Router } from '@angular/router';
import { RemoteService } from '../_services';
import { AVScene } from '../_models';
import { Observable } from 'rxjs';
import { MqttService } from 'ngx-mqtt';

@Component({
  selector: 'app-scene',
  template: `
  <div *ngFor="let sceneData of scenes| async" class="sensor s3" (click)="play(sceneData)">
      <div class="value" [class.grey]="(sceneData.name !== avstate)">{{sceneData.name | truncateHead}}</div>
  </div>`,
  styles: ['.grey {color:grey;}']
})

export class TabSceneComponent implements OnInit, OnDestroy {
  scenes: Observable<AVScene[]>;
  avstateSubscription: Subscription;
  avstate: string;
  filter: string;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private remote: RemoteService,
    private mqtt: MqttService
  ) {}

  ngOnInit() {
    this.filter = `avctrl/out/scene`;
    this.avstateSubscription = this.mqtt.observe(this.filter).subscribe((data) => {
      const av = JSON.parse(String(data.payload));
      this.avstate = av.activityName;
    });
    this.scenes = this.remote.getAVScenes();
  }

  ngOnDestroy() {
    this.avstateSubscription.unsubscribe();
    this.mqtt.observables[this.filter] = null;
  }

  play(scene: AVScene) {
    this.remote.setAVState(scene);
  }
}
