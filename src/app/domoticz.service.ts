import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { HttpClient } from '@angular/common/http';
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
  Timers?: string,
  HardwareID?: number,
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
    private http: HttpClient,
    private conf: ConfService) { }

  getDomoticzPlan(planId: number, hardwareName: string): Observable<Device[]> {
//    this.hardwareName = hardwareName;
//    console.log(this.hardwareName);
    return this.http.get<Domoticz>(this.conf.sceneUrl + 'plan=' + planId)
                    .map((res) => this.extractDevices(res, hardwareName));
  }

  private extractDevices(body: Domoticz, hardwareName: string) {
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
