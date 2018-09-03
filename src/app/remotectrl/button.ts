import { timer } from 'rxjs';
import { IconDefinition } from '@fortawesome/fontawesome-svg-core';

export enum IconType {
  media,
  scene,
  volume,
  media_pause,
  media_back,
  media_fwd
}

export class Button {
  activity: number;

  _enabled: boolean;
  set enabled(value: boolean) {
    this._enabled = value;
    if (value) {
      this._style = 'grey';
    } else {
      this._style = 'darkslategrey';
    }
  }
  private _icon: IconDefinition;
  set icon(value: IconDefinition) {
    this._icon = value;
  }

  get icon() {
    return this._icon;
  }

  private _style: string;
  get style(): string {
    return this._style;
  }

  private _icontype: IconType = IconType.media;
  get iconType(): IconType {
    return this._icontype;
  }

  constructor(icon: IconDefinition, activity: number, type: IconType) {
    this._icontype = type;
    this.activity = activity;
    this._icon = icon;
    this._style = 'grey'
  }


  click(): boolean {
    if (this._enabled) {
      this._style = 'orange';
      timer(200).toPromise().then(() => {
        this._style = 'grey';
      });
      return true;
    }
    return false;
  }
}
