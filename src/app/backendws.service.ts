import { Injectable } from '@angular/core';
import { Subject, Observable, Observer, Subscription } from 'rxjs/Rx';
import { Sensor, AVState, BackendMessage } from './backend-message';
import { ChromeCastStatus} from './chrome-cast-status';
import { ConfService } from './conf.service';

@Injectable()
export class BackendwsService {
  private socket: Subject<MessageEvent>;
  private subscription: Subscription;
  private sensorSubject: Subject<Sensor>;
  private ChromeSubject: Subject<ChromeCastStatus>;
  private AVStateSubject: Subject<AVState>;

  constructor(private conf: ConfService) {
    this.subscription = this.connect().subscribe(
      message => this.receive(message)
    );
  }

  connectSensor(): Observable<Sensor> {
    if (!this.sensorSubject) {
      this.sensorSubject = new Subject();
    }
    return this.sensorSubject.asObservable();
  }

  connectChrome(): Observable<ChromeCastStatus> {
    if (!this.ChromeSubject) {
      this.ChromeSubject = new Subject();
    }
    return this.ChromeSubject.asObservable();
  }

  connectAVState(): Observable<AVState> {
    if (!this.AVStateSubject) {
      this.AVStateSubject = new Subject();
    }
    return this.AVStateSubject.asObservable();
  }

  receive(message: MessageEvent) {
    const msg: BackendMessage = JSON.parse(message.data);
    switch (msg.func) {
      case 'sensormsg':
        if (this.sensorSubject) {
          this.sensorSubject.next(msg.status as Sensor);
        }
        break;
      case 'chromecast':
        if (this.ChromeSubject) {
          this.ChromeSubject.next(msg.status as ChromeCastStatus);
        }
        break;
      case 'domavstate':
        if (this.AVStateSubject) {
          this.AVStateSubject.next(msg.status as AVState);
        }
        break;
      default:
        console.log(msg);
        break;
    }
  }


  private connect(): Subject<MessageEvent> {
    const ws = new WebSocket(this.conf.socketUrl);

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
