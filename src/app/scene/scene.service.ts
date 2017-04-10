import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { Http, Response } from '@angular/http';
import 'rxjs/add/operator/catch';
import 'rxjs/add/operator/map';
import { ConfService } from '../conf.service';

export interface Scene {
  Name: string;
  idx: number;
  Status: string;
  HardwareName: string;
}

interface domoticz {
  ActTime: string;
  result : Scene[]
}

@Injectable()
export class SceneService {
  private err: any;
  constructor(
    private http: Http,
    private conf: ConfService) { }

  getScenes(): Observable<Scene[]> {
      return this.http.get(this.conf.sceneUrl + 'plan=2')
                      .map(this.extractScenes)
                      .catch(this.handleError);
  }

  private extractScenes(res: Response) {
      const body: domoticz = res.json();
      let scenes:Scene[] = Array<Scene>();
      body.result.forEach(s => {
        if (s.HardwareName == 'harmony') {
          s.Name = s.Name.substr(6);
          scenes.push(s);
        }
      })
      return scenes || [{}];
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
  switchScene(scene:Scene) {
    const url = this.conf.sceneUrl + 'switch=' + scene.idx + '&state=On';
    return this.http.get(url).toPromise();
  }
}
