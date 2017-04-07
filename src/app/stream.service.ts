import { Injectable } from '@angular/core';
import { Http, Response} from '@angular/http';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/catch';
import 'rxjs/add/operator/map';
import { Stream} from './stream';
import { ChromeStatus } from './chrome-status';
@Injectable()
export class StreamService {
    private streamUrl = "https://juletraesfoden.dk/chrome/";
    constructor (private http: Http) {}

    getStreams(type:string) : Observable<Stream[]> {
        let url = this.streamUrl + type + "/list";
        return this.http.get(url)
                        .map(this.extractData)
                        .catch(this.handleError);
    }

    private extractData(res:Response) {
        let body = res.json();
        return body || {};
    }

    private handleError (error: Response | any) {
        let errMsg : string;
        if (error instanceof Response) {
            const body = error.json() || '';
            const err= body.error || JSON.stringify(body);
            errMsg = `${error.status} - ${error.statusText || ''} ${err}`;
        } else {
            errMsg = error.message ? error.message : error.toString();
        }

        console.error(errMsg);
        return Observable.throw(errMsg);
    }

    public playStream(stream:Stream, device:string) {
        let url = this.streamUrl + device + "/play/" + stream.id;
        return this.http.get(url).toPromise();
    }

    public getStatus(device:string) : Observable<ChromeStatus> {
        let url = this.streamUrl + device + "/status";
        return this.http.get(url)
                        .map(this.extractData)
                        .catch(this.handleError);
    }
}
