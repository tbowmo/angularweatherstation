import { Component, OnInit } from '@angular/core';
import { Subscription} from 'rxjs/Subscription';
import { ActivatedRoute, Router } from '@angular/router';
import { MqttService } from 'ngx-mqtt';

interface SceneDTO {
  mqttName: string;
  name: string;
};

@Component({
  selector: 'app-scene',
  template: `
  <div *ngFor="let sceneData of scenes" class="sensor s3" (click)="play(sceneData)">
      <div class="value {{sceneData.mqttName}}" >{{sceneData.name | truncateHead}}</div>
  </div>`
})

export class SceneComponent implements OnInit {
  private errorMessage: any;
  scenes: SceneDTO[]
  sub: Subscription;

  constructor(
    private mqtt: MqttService,
    private route: ActivatedRoute,
    private router: Router
  ) {}

  ngOnInit() {
    this.scenes = [
      {
        mqttName: 'video',
        name: 'Video'
      },
      {
        mqttName: 'audio',
        name: 'Audio'
      },
      {
        mqttName: 'wii',
        name: 'WII'
      },
      {
        mqttName: 'tv',
        name: 'TV'
      },
      {
        mqttName: 'off',
        name: 'OFF'
      }
    ]
  }

  play(scene: SceneDTO) {
    this.mqtt.unsafePublish('avctrl/in/scene', scene.mqttName, {retain: false, qos: 2});
  }
}
