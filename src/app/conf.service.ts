import { Injectable } from '@angular/core';

@Injectable()
export class ConfService {
  private _serverName = 'juletraesfoden.dk';
  private _serverUrl = 'https://' + this._serverName + '/';

  constructor() {}

  public get avstateUrl(): string {
    return this._serverUrl + 'node/avstate';
  }
  public get chromeUrl(): string {
    return this._serverUrl + 'chrome/';
  }
  public get sceneUrl(): string {
    return this._serverUrl + 'node/test?';
  }
  public get sensorUrl(): string {
    return this._serverUrl + 'node/environment/';
  }
  public get socketUrl(): string {
    return 'wss://' + this._serverName + '/node/dashboard';
  }
}
