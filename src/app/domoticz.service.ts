import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { Http, Response } from '@angular/http';
import 'rxjs/add/operator/catch';
import 'rxjs/add/operator/map';
import { ConfService } from './conf.service';

export interface Device {
  Name: string;
  idx: number;
  Status: string;
  HardwareName: string;
  Humidity: number;
  Temp: number;
  HumidityStatus: string;
  Type: string;
  LastUpdate: Date;
}

interface Domoticz {
  ActTime: string;
  result: Device[];
}

@Injectable()
export class DomoticzService {
  private err: any;
  private hardwareName: string;

  constructor(
    private http: Http,
    private conf: ConfService) { }

  getDomoticzPlan(planId: number, hardwareName: string): Observable<Device[]> {
    this.hardwareName = hardwareName;
    console.log(this.hardwareName);
    return this.http.get(this.conf.sceneUrl + 'plan=' + planId)
                    .map((res) => this.extractDevices(res))
                    .catch(this.handleError);
  }

  private extractDevices(res: Response) {
      const body: Domoticz = res.json();
      const devices:  Device[] = Array<Device>();
      console.log(this.hardwareName);
      body.result.forEach(s => {
        console.log(this.hardwareName);
        if (s.HardwareName === this.hardwareName) {
          devices.push(s);
        }
      });
      return devices || [{}];
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

  switchScene(scene: Device) {
    const url = this.conf.sceneUrl + 'switch=' + scene.idx + '&state=On';
    return this.http.get(url).toPromise();
  }
}
