import { Injectable } from '@angular/core';
import { Http, Response} from '@angular/http';
import { Observable } from 'rxjs/Observable';
import { Subject, Subscription } from 'rxjs/Rx';
import 'rxjs/add/operator/catch';
import 'rxjs/add/operator/map';
import { ConfService } from '../conf.service';
import { BackendwsService } from '../backendws.service';
import { BackendMessage, Sensor } from '../backend-message';

@Injectable()
export class SensorService {
  private _sensors: Subject<Sensor>;
  private connection: Subscription;
  private sensorList: Sensor[];

  constructor (
    private http: Http,
    private backend: BackendwsService,
    private conf: ConfService) {
    this._sensors = new Subject();
    this.sensorList = new Array<Sensor>();
    this.connection = this.backend.connectSensor()
          .subscribe(message => this.backendReceiver(message));
  }

  get sensorsStream(): Observable<Sensor> {
    return this._sensors.asObservable();
  }

  public fetchSensor(id, type)  {
    const url = this.conf.sensorUrl + '?node=' + id.toString() + '&subType=' + type.toString();
    const sensor = this.ToHex(id) + this.ToHex(type);
    if (this.sensorList[sensor] !== undefined) {
      this._sensors.next(this.sensorList[sensor]);
    } else {
      this.http.get(url).toPromise().then(
        response => {
          const s: Sensor = new Sensor();
          const data = response.json();
          s.subType = type;
          s.nodeId = id;
          s.payload = data[0].last;
          this.sensorList[sensor] = s;
          this._sensors.next(s);
        }
      );
    }
  }

  private ToHex(i: number): string {
    const str = Number(i).toString(16);
    return str.length === 1 ? '0' + str : str;
  }

  backendReceiver(message: Sensor) {
    const sensorid = this.ToHex(message.nodeId) + this.ToHex(message.subType);
    this.sensorList[sensorid] = message;
    this._sensors.next(message);
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
