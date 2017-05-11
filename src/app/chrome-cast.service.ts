import { Injectable } from '@angular/core';
import { Http, Response} from '@angular/http';
import { ReplaySubject } from 'rxjs/ReplaySubject';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/catch';
import 'rxjs/add/operator/map';
import { ChromeCastStream} from './chrome-cast-stream';
import { ChromeCastStatus } from './chrome-cast-status';
import { BackendwsService } from './backendws.service';
import { BackendMessage } from './backend-message';
import { ConfService } from './conf.service';

@Injectable()
export class ChromeCastService {

    private _chromeSubject: ReplaySubject<ChromeCastStatus>;
    private connection: any;
    private device: string;
    constructor (
      private http: Http,
      private backendWsService: BackendwsService,
      private conf: ConfService) {
      this._chromeSubject = new ReplaySubject(1);
      this.connection = this.backendWsService.connectChrome()
            .subscribe((message: ChromeCastStatus) => {
              this.device = message.device_name;
              this._chromeSubject.next(message);
            });
      const url = this.conf.chromeUrl + 'status';
      this.http.get(url).toPromise().then((result) => {
        const data:ChromeCastStatus = result.json();
        this.device = data.device_name;
        this._chromeSubject.next(data);
      });
    }

    getStreams(type: string): Observable<ChromeCastStream[]> {
        const url = this.conf.chromeUrl + type + '/list';
        return this.http.get(url)
                        .map((res: Response) => {
                          return res.json() || {}
                        })
                        .catch(this.handleError);
    }

    private handleError (error: Response | any) {
        let errMsg: string;
        if (error instanceof Response) {
            const body = error.json() || '';
            const err = body.error || JSON.stringify(body);
            errMsg = `${error.status} - ${error.statusText || ''} ${err}`;
        } else {
            errMsg = error.message ? error.message : error.toString();
        }

        console.error(errMsg);
        return Observable.throw(errMsg);
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
      const url = this.conf.chromeUrl + this.getDevice() + '/pause';
      this.http.get(url).toPromise().then((result) => {
        const data = result.json();
        this._chromeSubject.next(data);
      });
    }

    /**
     * Starts playying again, after a pause has been issued
     * @return {none}
     */
    public play() {
      const url = this.conf.chromeUrl + this.getDevice() + '/play';
      this.http.get(url).toPromise().then((result) => {
        const data = result.json();
        this._chromeSubject.next(data);
      });
    }

    /**
     * Skips to next track (if supported)
     * @return {none}
     */
    public next() {
      const url = this.conf.chromeUrl + this.getDevice() + '/skip';
      this.http.get(url).toPromise().then((result) => {
        const data = result.json();
        this._chromeSubject.next(data);
      });
    }

    public previous() {
      const url = this.conf.chromeUrl + this.getDevice()+'/previous';
      this.http.get(url).toPromise().then((result) => {
        const data = result.json();
        this._chromeSubject.next(data);
      });
    }

    public getStatus(): Observable<ChromeCastStatus> {
        return this._chromeSubject.asObservable();
    }

    private getDevice(): string {
      if (this.device.includes("Audio")) {
        return "audio";
      } else {
        return "video";
      }
    }
}
