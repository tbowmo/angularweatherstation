import { Injectable } from '@angular/core';

@Injectable()
export class ConfService {
  private _serverName = 'chrome.juletraesfoden.dk';
  private _serverUrl = 'https://' + this._serverName + '/';

  constructor() {}

  public get chromeUrl(): string {
    return this._serverUrl;
  }
}
