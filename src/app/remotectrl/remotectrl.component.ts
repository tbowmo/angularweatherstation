import { Component, OnInit, OnDestroy } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { Subscription} from 'rxjs/Subscription';
import { Button, IconType } from './button';
import { ChromeCastService } from '../chrome-cast.service';
import { AvstateService } from '../avstate/avstate.service';
import { BackendMessage, AVState } from '../backend-message';
import { DomoticzService, Device} from '../domoticz.service';
import { BackendwsService,  } from '../backendws.service';

@Component({
  selector: 'app-remotectrl',
  template: `
  <div *ngFor="let button of buttons; let i = index;" class="sensor s6" (click)="activate(button, i)">
    <div class="value"><img src="assets/spacer.png" class="valueicon" [ngStyle]="{'left':button.left, 'background':button.background }"></div>
  </div>`
})

export class RemotectrlComponent implements OnInit, OnDestroy {

  buttons: Button[];
  private chromeSubscription: Subscription;
  private error: any;
  private avsub: Subscription;
  private currentScene: string = "";

  constructor(
    private chrome: ChromeCastService,
    private avstateService: AvstateService,
    private domoticz: DomoticzService,
    private backend: BackendwsService) { }

  ngOnInit() {
    this.buttons = Array<Button>();
    this.buttons.push(new Button(7, 10, IconType.volume));
    this.buttons.push(new Button(8, 11, IconType.volume));
    this.buttons.push(new Button(6, 12, IconType.media_back));
    this.buttons.push(new Button(3, 13, IconType.media_pause));
    this.buttons.push(new Button(5, 14, IconType.media_fwd));
    this.buttons.push(new Button(4, 15, IconType.scene));

    this.enable(IconType.volume);
    this.chromeSubscription = this.chrome.getStatus().subscribe(d => this.handleState(d));
    this.avsub = this.avstateService.getState()
        .subscribe(val => this.updateState(val),
                   error => this.error = error);
  }

  handleState(state) {
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
/*    if ((state.chromeApp !== "Radio") && (state.chromeApp !== 'Backdrop') && (this.currentScene.includes('Stream'))) {
      this.enable(IconType.media);
    } else {
      this.disable(IconType.media);
    }*/
    if (state.player_state === 'PLAYING') {
      this.buttons[3].icon = 2;
      this.buttons[3].activity = 16;
    } else {
      this.buttons[3].icon = 3;
      this.buttons[3].activity = 13;
    }
  }

  private updateState(val:AVState) {
    this.currentScene = val.status.scene;
/*    if (val.status.scene.includes('Stream')) {
      this.enable(IconType.media);
    } else {
      this.disable(IconType.media);
    }
*/
    if (val.status.scene === "PowerOff") {
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
    let msg: BackendMessage =  {
      func: "remote",
      status: { t: ""}
    }
    if (button.click()) {
      switch (button.activity) {
        case 10:
          msg.status = {t: "voldown"};
          this.backend.transmit(msg);
          // Volume down
          break;
        case 11:
          msg.status = { t: "volup"}
          this.backend.transmit(msg);
          break;
        case 12:
          this.chrome.previous();
          break;
        case 13:
          this.chrome.play();
          break;
        case 14:
          this.chrome.next();
          break;
        case 16:
          this.chrome.pause();
          break;
        case 15:
          const scene: Device = {
            idx: 124 // Power off in domoticz
          }
          this.domoticz.switchScene(scene)
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
