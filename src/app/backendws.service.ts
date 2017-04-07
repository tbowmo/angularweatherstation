import { Injectable } from '@angular/core';
import { Subject, Observable, Observer } from 'rxjs/Rx';

@Injectable()
export class BackendwsService {
  private socket: Subject<MessageEvent>;

  public connect(): Subject<MessageEvent> {
    if (!this.socket) {
      this.socket = this.create();
    }
    return this.socket;
  }
  constructor() { }

  public create() : Subject<MessageEvent> {
    const ws = new WebSocket('wss://juletraesfoden.dk/node/dashboard');
    const observable = Observable.create(
      (obs: Observer<MessageEvent>) => {
        ws.onmessage = obs.next.bind(obs);
        ws.onerror = obs.error.bind(obs);
        ws.onclose = obs.complete.bind(obs);

        return ws.close.bind(ws);
      }
    );

    const observer = {
      next: (data: Object) => {
        if (ws.readyState === WebSocket.OPEN) {
          ws.send(JSON.stringify(data));
        }
      },
    };

    return Subject.create(observer, observable);
  }
}
