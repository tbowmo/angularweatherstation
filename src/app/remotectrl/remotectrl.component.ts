import { Component, OnInit, OnDestroy } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { Subscription} from 'rxjs/Subscription';
import { Button, IconType } from './button';
import { ChromeCastService } from '../chrome-cast.service';
@Component({
  selector: 'app-remotectrl',
  templateUrl: './remotectrl.component.html',
  styleUrls: ['./remotectrl.component.css']
})

export class RemotectrlComponent implements OnInit, OnDestroy {
  buttons: Button[];
  private chromeSubscription: Subscription;
  constructor(private chrome: ChromeCastService) { }

  ngOnInit() {
    this.buttons = Array<Button>();
    this.buttons.push(new Button(7, 10, IconType.volume));
    this.buttons.push(new Button(8, 11, IconType.volume));
    this.buttons.push(new Button(6, 12, IconType.media));
    this.buttons.push(new Button(3, 13, IconType.media));
    this.buttons.push(new Button(5, 14, IconType.media));
    this.buttons.push(new Button(4, 15, IconType.scene));

    this.enable(IconType.volume);
    this.chromeSubscription = this.chrome.getStatus().subscribe(d => {
      if (d.chromeApp !== 'Backdrop') {
        this.enable(IconType.media);
      } else {
        this.disable(IconType.media);
      }
      if (d.player_state === 'PLAYING') {
        this.buttons[3].icon = 2;
        this.buttons[3].activity = 16;
      } else {
        this.buttons[3].icon = 3;
        this.buttons[3].activity = 13;
      }
    });
  }

  ngOnDestroy() {
    this.chromeSubscription.unsubscribe();
  }
  activate(button: Button, index: number) {
    if (button.click()) {
      switch (button.activity) {
        case 13:
          this.chrome.play();
          break;
        case 14:
          this.chrome.next();
          break;
        case 16:
          this.chrome.pause();
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
