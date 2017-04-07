import { Injectable } from '@angular/core';
import { Http, Response} from '@angular/http';
import { Observable } from 'rxjs/Observable';
import { Subject } from 'rxjs/Rx';
import 'rxjs/add/operator/catch';
import 'rxjs/add/operator/map';
import { Conf } from '../configuration';
import { BackendwsService } from '../backendws.service';
import { BackendMessage, Sensor } from '../backend-message';

@Injectable()
export class SensorService {
  serverUrl = 'https://juletraesfoden.dk/node/environment/';
  private _sensors: Subject<Sensor>;
  connection: any;
  test: Sensor;

  constructor (private http: Http, private backend: BackendwsService) {
    this._sensors = new Subject();
    this.connection = this.backend.connect()
          .subscribe(message => this.testFunc(message));
  }

  public sensor(id, type): Observable<Sensor>  {
    const url = this.serverUrl + '?node=' + id.toString() + '&subType=' + type.toString();
    this.http.get(url).toPromise().then(
      response => {
        const data = response.json();
        this._sensors.next(data);
      }
    );
    return this._sensors.asObservable();
  }

/*
  getSensor() : Observable<Sensor> {
      let url = this.serverUrl + '?node=' + id.toString() + "&subType=" + type.toString();


      return this.http.get(url)
                      .map(this.extractData)
                      .catch(this.handleError);
  }
*/
  private extractData(res: Response) {
      const body = res.json();
      console.log(body);
      if (body[0] !== undefined) {
          return body[0].last;
      } else {
          return 0;
      }
  }

  testFunc(message: any) {
    const t: BackendMessage = JSON.parse(message.data);
    if (t.func === 'sensormsg') {
      const test: Sensor = t.status as Sensor;
      this._sensors.next(test);
    }
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
}
