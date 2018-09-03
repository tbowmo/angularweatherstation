import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { ConfigurationDTO } from '../_models/configuration';
import { IMqttServiceOptions } from 'ngx-mqtt';
import { Room, AVScene } from '../_models';

@Injectable()
export class ConfService {
  private _conf: ConfigurationDTO;
  constructor(private http: HttpClient) {
  }

  public loadConfig() {
    return new Promise((resolve) => {
      this.http.get('configuration.json').toPromise().then((data) => {
        this._conf = data as ConfigurationDTO;
      });
      resolve(true);
    });
  }

  public get chromeUrl(): string {
    return this._conf.endpoints.chromecast;
  }

  public get mqttConf(): IMqttServiceOptions {
    return this._conf.mqtt;
  }

  public get getRooms(): Room[] {
    return this._conf.rooms;
  }

  public get getScenes(): AVScene[] {
    return this._conf.scenes;
  }

}
