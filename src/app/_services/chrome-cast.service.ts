import { ChromeCastStatus } from '../_models';
import { ChromeCastStream } from '../_models';
import { ConfService } from './conf.service';
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { ReplaySubject } from 'rxjs/ReplaySubject';
import { Subscription } from 'rxjs/Subscription';
import 'rxjs/add/operator/catch';
import 'rxjs/add/operator/map';
import { MqttService } from 'ngx-mqtt';

@Injectable()
export class ChromeCastService {

    private _chromeSubject: ReplaySubject<ChromeCastStatus>;
    private connection: Subscription;
    private device: string;
    private deviceType: string;

    constructor (
      private http: HttpClient,
      private mqtt: MqttService,
      private conf: ConfService) {
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
