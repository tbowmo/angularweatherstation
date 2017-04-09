import { Injectable } from '@angular/core';
import { Http, Response} from '@angular/http';
import { ReplaySubject } from 'rxjs/ReplaySubject';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/catch';
import 'rxjs/add/operator/map';
import { Conf } from '../configuration';
import { BackendwsService } from '../backendws.service';
import { BackendMessage, AVState } from '../backend-message';

@Injectable()
export class AvstateService {
  serverUrl = 'https://juletraesfoden.dk/node/avstate';
  private _avState: ReplaySubject<AVState>;
  private connection: any;

  constructor(private http: Http, private backendWsService: BackendwsService) {
    this._avState = new ReplaySubject(1);
    this.connection = this.backendWsService.connectAVState()
            .subscribe(message => { this._avState.next(message); });
  }

  getState(): Observable<AVState> {
    this.http.get(this.serverUrl).toPromise().then((result) => {
      const data = result.json();
      this._avState.next(data);
    });

    return this._avState.asObservable();
  }

  private handleError(error: Response | any) {
    let errMsg: string;
    if (error instanceof Response) {
        const body = error.json() || '';
        const err = body.error || JSON.stringify(body);
        errMsg = `${error.status} - ${error.statusText || ''} ${err}`;
    } else {
        errMsg = error.message ? error.message : error.toString();
    }

    console.error(errMsg);
    return Observable.throw(errMsg);  }
}
