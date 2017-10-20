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
  private sensorList: Sensor[][][];

  constructor (
    private http: Http,
    private backend: BackendwsService,
    private conf: ConfService) {
    this._sensors = new Subject();
    this.sensorList = []; //new Array<Sensor>();
    this.connection = this.backend.connectSensor()
          .subscribe(message => this.backendReceiver(message));
  }

  get sensorsStream(): Observable<Sensor> {
    return this._sensors.asObservable();
  }

  public fetchSensor(id: number, type: number, child?: number)  {
    let url = this.conf.sensorUrl + '?node=' + id.toString() + '&subType=' + type.toString();
    if (child !== undefined) {
      url = url + "&sensor=" + child.toString();
    } else {
      child = 1;
    }
    if (this.sensorList[id] !== undefined
        && this.sensorList[id][type] !== undefined
        && this.sensorList[id][type][child] !== undefined) {
      this._sensors.next(this.sensorList[id][type][child]);
    } else {
      this.http.get(url).toPromise().then(
        response => {
          const s: Sensor = new Sensor();
          const data = response.json();
          s.subType = type;
          s.nodeId = id;
          s.payload = data.last;
          s.childSensorId = child;
          if (this.sensorList[id] === undefined) {
            this.sensorList[id] = [];
          }
          if (this.sensorList[id][type] === undefined) {
            this.sensorList[id][type] = [];
          }
          this.sensorList[id][type][child] = s;
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
    if (this.sensorList[message.nodeId] === undefined) {
      this.sensorList[message.nodeId] = [];
    }
    if (this.sensorList[message.nodeId][message.subType] === undefined) {
      this.sensorList[message.nodeId][message.subType] = [];
    }
    this.sensorList[message.nodeId][message.subType][message.childSensorId] = message;
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
