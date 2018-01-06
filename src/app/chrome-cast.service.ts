import { BackendMessage } from './backend-message';
import { BackendwsService } from './backendws.service';
import { ChromeCastStatus } from './chrome-cast-status';
import { ChromeCastStream } from './chrome-cast-stream';
import { ConfService } from './conf.service';
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { ReplaySubject } from 'rxjs/ReplaySubject';
import { Subscription } from 'rxjs/Subscription';
import 'rxjs/add/operator/catch';
import 'rxjs/add/operator/map';

@Injectable()
export class ChromeCastService {

    private _chromeSubject: ReplaySubject<ChromeCastStatus>;
    private connection: Subscription;
    private device: string;
    private deviceType: string;

    constructor (
      private http: HttpClient,
      private backendWsService: BackendwsService,
      private conf: ConfService) {
      this._chromeSubject = new ReplaySubject(1);
      this.connection = this.backendWsService.connectChrome()
            .subscribe((message: ChromeCastStatus) => {
              this.device = message.device_name;
              this._chromeSubject.next(message);
            });
      const url = this.conf.chromeUrl + 'status';
      this.http.get<ChromeCastStatus>(url).toPromise().then((data) => {
        this.device = data.device_name;
        this.deviceType = data.device_type;
        this._chromeSubject.next(data);
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
