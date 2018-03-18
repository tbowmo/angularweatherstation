import { BackendMessage } from '../_models';
import { BackendwsService } from './backendws.service';
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

    getStreams(type: string): Observable<ChromeCastStream[]> {
        const url = this.conf.chromeUrl + type + '/list';
        return this.http.get<ChromeCastStream[]>(url);
    }

    public playStream(stream: ChromeCastStream, device: string) {
        const url = this.conf.chromeUrl + device + '/play/' + stream.id;
        return this.http.get(url).toPromise();
    }

    /**
     * Pause current playing item
     * @return {[type]} [description]
     */
    public pause() {
      const url = this.conf.chromeUrl + this.deviceType + '/pause';
      this.http.get<ChromeCastStatus>(url).toPromise().then((data) => {
        this._chromeSubject.next(data);
      });
    }

    /**
     * Starts playing again, after a pause has been issued
     * @return {none}
     */
    public play() {
      const url = this.conf.chromeUrl + this.deviceType + '/play';
      this.http.get<ChromeCastStatus>(url).toPromise().then((data) => {
        this._chromeSubject.next(data);
      });
    }

    /**
     * Skips to next track (if supported)
     * @return {none}
     */
    public next() {
      const url = this.conf.chromeUrl + this.deviceType + '/skip';
      this.http.get<ChromeCastStatus>(url).toPromise().then((data) => {
        this._chromeSubject.next(data);
      });
    }

    public previous() {
      const url = this.conf.chromeUrl + this.deviceType + '/previous';
      this.http.get<ChromeCastStatus>(url).toPromise().then((data) => {
        this._chromeSubject.next(data);
      });
    }

    public getStatus(): Observable<ChromeCastStatus> {
        return this._chromeSubject.asObservable();
    }
}
