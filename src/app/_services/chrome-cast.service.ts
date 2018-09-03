import { ChromeCastStatus } from '../_models';
import { Injectable } from '@angular/core';
import { Observable, ReplaySubject } from 'rxjs';


import { MqttService } from 'ngx-mqtt';

@Injectable()
export class ChromeCastService {

  private _chromeSubject: ReplaySubject<ChromeCastStatus>;

  constructor(
    private mqtt: MqttService
    ) {
    this._chromeSubject = new ReplaySubject(1);
    this.mqtt.observe('chromecast/+/media').subscribe((data) => {
      const chrome: ChromeCastStatus = JSON.parse(data.payload.toString()) as ChromeCastStatus;
      this._chromeSubject.next(chrome);
    });
  }

  public getStatus(): Observable<ChromeCastStatus> {
    return this._chromeSubject.asObservable();
  }
}
