import { Observable } from 'rxjs/Observable';

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
  private _set: string[];
  private _iconset: number;

  set iconset(value: number) {
    this._iconset = value;
  }

  private _icon: number;
  set icon(value: number) {
    this._icon = value - 1;
  }

  get useIcon(): boolean {
    if (this._icon >= 0) {
      return true;
    }
    return false;
  }

  private _icontype: IconType = IconType.media;
  get iconType(): IconType {
    return this._icontype;
  }

  constructor(icon: number, activity: number, type: IconType) {
    this._icontype = type;
    this._icon = icon - 1;
    this.activity = activity;
    this._set = ['icons-darkgrey.png', 'icons-grey.png', 'icons-orange.png'];
    this._iconset = 0;
  }

  get left(): string {
    return (this._icon * 126).toString() + 'px';
  }

  get background(): string {
    return 'url("assets/' + this._set[this._iconset] + '") ' + '-' + (this._icon * 126).toString() + 'px -20px';
  }


  click(): boolean {
    if (this._iconset > 0) {
      this._iconset = 2;
      Observable.timer(200).toPromise().then(i => {
        this._iconset = 1;
      });
      return true;
    }
    return false;
  }
}
