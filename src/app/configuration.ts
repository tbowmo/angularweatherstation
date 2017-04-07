export class Conf {
  private _serverUrl : string = "https://juletraesfoden.dk/";
  private _sensorUrl : string = this._serverUrl + "/node/environment";

  public get sensorUrl():string {
    return this._sensorUrl;
  }
}
