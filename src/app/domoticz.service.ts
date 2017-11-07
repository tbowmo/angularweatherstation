import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { Http, Response } from '@angular/http';
import 'rxjs/add/operator/catch';
import 'rxjs/add/operator/map';
import { ConfService } from './conf.service';

export interface Device {
  Favorite?: number,
  Name?: string;
  idx?: number;
  Status?: string;
  HardwareName?: string;
  Humidity?: number;
  Temp?: number;
  HumidityStatus?: string;
  Type?: string;
  LastUpdate?: Date;
  Timers? : string,
  HardwareID? : number,
}

interface Domoticz {
  ActTime: string;
  result: Device[];
}

@Injectable()
export class DomoticzService {
  private err: any;
//  private hardwareName: string;

  constructor(
    private http: Http,
    private conf: ConfService) { }

  getDomoticzPlan(planId: number, hardwareName: string): Observable<Device[]> {
//    this.hardwareName = hardwareName;
//    console.log(this.hardwareName);
    return this.http.get(this.conf.sceneUrl + 'plan=' + planId)
                    .map((res) => this.extractDevices(res, hardwareName))
                    .catch(this.handleError);
  }

  private extractDevices(res: Response, hardwareName: string) {
      const body: Domoticz = res.json();
      const devices:  Device[] = Array<Device>();
      console.log(hardwareName);
      body.result.forEach(s => {
        console.log(hardwareName);
        if (s.HardwareName === hardwareName) {
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
    let url = this.conf.sceneUrl;
    if (scene.Type === 'Scene' || scene.Type === 'Group') {
      url = url + 'switchscene&idx=' + scene.idx + '&switchcmd=On'
    } else {
      url =  url + 'switch=' + scene.idx + '&state=On';
    }
    return this.http.get(url).toPromise();
  }


}
