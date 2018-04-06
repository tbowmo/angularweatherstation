import { Component, OnInit, OnDestroy } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { Subscription} from 'rxjs/Subscription';
import { Button, IconType } from './button';
import { ChromeCastService } from '../_services';
import { ChromeCastStatus } from '../_models';
import { MqttService } from 'ngx-mqtt';
import { RemoteService } from '../_services';

@Component({
  selector: 'app-remotectrl',
  template: `
  <div *ngFor="let button of buttons; let i = index;" class="sensor s6" (click)="activate(button, i)">
    <div class="value">
      <img src="assets/spacer.png" class="valueicon" [ngStyle]="{'left':button.left, 'background':button.background }"/>
    </div>
  </div>`
})

export class RemotectrlComponent implements OnInit, OnDestroy {

  buttons: Button[];
  private chromeSubscription: Subscription;
  private error: any;
  private avsub: Subscription;
  private currentScene = '';

  constructor(
    private chrome: ChromeCastService,
    private mqtt: MqttService,
    private remote: RemoteService
  ) { }

  ngOnInit() {
    this.buttons = Array<Button>();
    this.buttons.push(new Button(7, 10, IconType.volume));
    this.buttons.push(new Button(8, 11, IconType.volume));
    this.buttons.push(new Button(6, 12, IconType.media_back));
    this.buttons.push(new Button(3, 13, IconType.media_pause));
    this.buttons.push(new Button(5, 14, IconType.media_fwd));
    this.buttons.push(new Button(4, 15, IconType.scene));

    this.enable(IconType.volume);
    this.chromeSubscription = this.mqtt.observe('chromecast/+/media').subscribe((data) => {
      const d = JSON.parse(data.payload.toString()) as ChromeCastStatus;
      console.log(d);
      this.handleState(d);
    });
    this.avsub = this.mqtt.observe('avctrl/out/scene/#').subscribe((data) => {
      const d = JSON.parse(data.payload.toString());
      this.updateState(d.activityName);
    });
  }

  handleState(state: ChromeCastStatus) {
    if (state.skip_fwd) {
      this.enable(IconType.media_fwd);
    } else {
      this.disable(IconType.media_fwd);
    }

    if (state.skip_bck) {
      this.enable(IconType.media_back);
    } else {
      this.disable(IconType.media_back);
    }
    if (state.pause) {
      this.enable(IconType.media_pause);
    } else {
      this.disable(IconType.media_pause);
    }
    if ((state.chrome_app !== 'Radio') && (state.chrome_app !== 'Backdrop') && (this.currentScene.includes('Stream'))) {
      this.enable(IconType.media);
    } else {
      this.disable(IconType.media);
    }
    if (state.player_state === 'PLAYING') {
      this.buttons[3].icon = 2;
      this.buttons[3].activity = 16;
    } else {
      this.buttons[3].icon = 3;
      this.buttons[3].activity = 13;
    }
  }

  private updateState(val: string) {
    this.currentScene = val;
    if (val.includes('Stream') || val === 'CD' || val === 'DVD') {
      this.enable(IconType.media);
    } else {
      this.disable(IconType.media);
    }

    if (val === 'PowerOff') {
      this.disable(IconType.volume);
      this.disable(IconType.scene);
    } else {
      this.enable(IconType.volume);
      this.enable(IconType.scene);
    }
  }

  ngOnDestroy() {
    this.chromeSubscription.unsubscribe();
    this.avsub.unsubscribe();
  }

  activate(button: Button, index: number) {
    if (button.click()) {
      switch (button.activity) {
        case 10:
          this.remote.volumeDown();
          break;
        case 11:
          this.remote.volumeUp()
          break;
        case 12:
          this.remote.previous();
          break;
        case 13:
          this.remote.play();
          break;
        case 14:
          this.remote.next();
          break;
        case 16:
          this.remote.pause();
          break;
        case 15:
          // Power off
          break;
      }
    }
  }

  enable(type: IconType) {
    this.buttons.forEach((c, i, a) => {
      if (this.buttons[i].iconType === type) {
        this.buttons[i].iconset = 1;
      }
    });
  }

  disable(type: IconType) {
    this.buttons.forEach((c, i, a) => {
      if (this.buttons[i].iconType === type) {
        this.buttons[i].iconset = 0;
      }
    });
  }
}
