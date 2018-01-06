import { Injectable } from '@angular/core';
import { HttpClient} from '@angular/common/http';
import { ReplaySubject } from 'rxjs/ReplaySubject';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/catch';
import 'rxjs/add/operator/map';
import { ConfService } from '../conf.service';
import { BackendwsService } from '../backendws.service';
import { BackendMessage, AVState } from '../backend-message';

@Injectable()
export class AvstateService {
  private _avState: ReplaySubject<AVState>;
  private connection: any;

  constructor(
    private http: HttpClient,
    private backendWsService: BackendwsService,
    private conf: ConfService) {
    this._avState = new ReplaySubject(1);
    this.connection = this.backendWsService.connectAVState()
            .subscribe(message => { this._avState.next(message); });
  }

  getState(): Observable<AVState> {
    this.http.get<AVState>(this.conf.avstateUrl).toPromise().then((data) => {
      this._avState.next(data);
    });
    return this._avState.asObservable();
  }
}
