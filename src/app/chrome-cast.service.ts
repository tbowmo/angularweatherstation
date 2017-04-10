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

    constructor (
      private http: Http,
      private backendWsService: BackendwsService,
      private conf: ConfService) {
      this._chromeSubject = new ReplaySubject(1);
      this.connection = this.backendWsService.connectChrome()
            .subscribe(message => { this._chromeSubject.next(message); });
    }

    getStreams(type: string): Observable<ChromeCastStream[]> {
        const url = this.conf.chromeUrl + type + '/list';
        return this.http.get(url)
                        .map(this.extractStreams)
                        .catch(this.handleError);
    }

    private extractStreams(res: Response) {
        const body = res.json();
        return body || {};
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

    public getStatus(): Observable<ChromeCastStatus> {
        const url = this.conf.chromeUrl + 'status';
        this.http.get(url).toPromise().then((result) => {
          const data = result.json();
          this._chromeSubject.next(data);
        });
        return this._chromeSubject.asObservable();
    }
}
