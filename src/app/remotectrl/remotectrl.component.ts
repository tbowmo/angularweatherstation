import { Component, OnInit, OnDestroy } from '@angular/core';
import { Subscription} from 'rxjs';
import { Button, IconType } from './button';
import { ChromeCastStatus } from '../_models';
import { MqttService } from 'ngx-mqtt';
import { RemoteService } from '../_services';
import { faPlay, faForward, faBackward, faPowerOff, faPause, faVolumeUp, faVolumeDown } from '@fortawesome/free-solid-svg-icons';
@Component({
  selector: 'app-remotectrl',
  template: `
  <div *ngFor="let button of buttons; let i = index;" class="sensor s6" (click)="activate(button, i)">
    <div class="value">
      <fa-icon [icon]="button.icon" [ngStyle]="{color:button.style}"></fa-icon>
    </div>
  </div>`
})

export class RemotectrlComponent implements OnInit, OnDestroy {
  buttons: Button[];
  private chromeSubscription: Subscription;
  private avsub: Subscription;
  private currentScene = '';

  constructor(
    private mqtt: MqttService,
    private remote: RemoteService
  ) { }

  ngOnInit() {
    this.buttons = Array<Button>();
    this.buttons.push(new Button(faVolumeDown, 10, IconType.volume));
    this.buttons.push(new Button(faVolumeUp, 11, IconType.volume));
    this.buttons.push(new Button(faBackward, 12, IconType.media_back));
    this.buttons.push(new Button(faPause, 13, IconType.media_pause));
    this.buttons.push(new Button(faForward, 14, IconType.media_fwd));
    this.buttons.push(new Button(faPowerOff, 15, IconType.scene));

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
      this.buttons[3].icon = faPause;
      this.buttons[3].activity = 16;
    } else {
      this.buttons[3].icon = faPlay;
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

  activate(button: Button) {
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
    this.buttons.forEach((_c, i, _a) => {
      if (this.buttons[i].iconType === type) {
        this.buttons[i].enabled = true;
      }
    });
  }

  disable(type: IconType) {
    this.buttons.forEach((_c, i, _a) => {
      if (this.buttons[i].iconType === type) {
        this.buttons[i].enabled = false;
      }
    });
  }
}
