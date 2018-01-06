import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs/Observable';
import { Subject, Subscription } from 'rxjs/Rx';
import 'rxjs/add/operator/catch';
import 'rxjs/add/operator/map';
import { ConfService } from '../conf.service';
import { BackendwsService } from '../backendws.service';
import { BackendMessage, Sensor } from '../backend-message';

class SensorResponse {
  last: any;
}

@Injectable()
export class SensorService {
  private _sensors: Subject<Sensor>;
  private connection: Subscription;
  private sensorList: Sensor[][][];

  constructor (
    private http: HttpClient,
    private backend: BackendwsService,
    private conf: ConfService) {
    this._sensors = new Subject();
    this.sensorList = []; // new Array<Sensor>();
    this.connection = this.backend.connectSensor()
          .subscribe(message => this.backendReceiver(message));
  }

  get sensorsStream(): Observable<Sensor> {
    return this._sensors.asObservable();
  }

  public fetchSensor(id: number, type: number, child?: number)  {
    let url = this.conf.sensorUrl + '?node=' + id.toString() + '&subType=' + type.toString();
    if (child !== undefined) {
      url = url + '&sensor=' + child.toString();
    } else {
      child = 1;
    }
    if (this.sensorList[id] !== undefined
        && this.sensorList[id][type] !== undefined
        && this.sensorList[id][type][child] !== undefined) {
      this._sensors.next(this.sensorList[id][type][child]);
    } else {
      this.http.get<SensorResponse>(url).toPromise().then(
        data => {
          const s: Sensor = new Sensor();
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
}
