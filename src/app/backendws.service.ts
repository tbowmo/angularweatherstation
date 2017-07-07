import { Injectable } from '@angular/core';
import { Subject, Observable, Observer, Subscription } from 'rxjs/Rx';
import { Sensor, AVState, BackendMessage } from './backend-message';
import { ChromeCastStatus} from './chrome-cast-status';
import { ConfService } from './conf.service';

@Injectable()
export class BackendwsService {
  private socket: WebSocket;
  private subscription: Subscription;
  private sensorSubject: Subject<Sensor>;
  private ChromeSubject: Subject<ChromeCastStatus>;
  private AVStateSubject: Subject<AVState>;

  constructor(private conf: ConfService) {
    this.subscription = this.connect().subscribe(
      message => this.receive(message)
    );
  }

  public connectSensor(): Observable<Sensor> {
    if (!this.sensorSubject) {
      this.sensorSubject = new Subject();
    }
    return this.sensorSubject.asObservable();
  }

  public connectChrome(): Observable<ChromeCastStatus> {
    if (!this.ChromeSubject) {
      this.ChromeSubject = new Subject();
    }
    return this.ChromeSubject.asObservable();
  }

  public connectAVState(): Observable<AVState> {
    if (!this.AVStateSubject) {
      this.AVStateSubject = new Subject();
    }
    return this.AVStateSubject.asObservable();
  }

  public transmit(message: BackendMessage): void {
    this.socket.send(JSON.stringify(message));
  }

  private receive(message: MessageEvent) {
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
          console.log(msg);
          this.AVStateSubject.next(msg as AVState);
        }
        break;
      default:
        console.log(msg);
        break;
    }
  }

  private connect(): Subject<MessageEvent> {
    this.socket = new WebSocket(this.conf.socketUrl);

    const observable = Observable.create(
      (obs: Observer<MessageEvent>) => {
        this.socket.onmessage = obs.next.bind(obs);
        this.socket.onerror = obs.error.bind(obs);
        this.socket.onclose = obs.complete.bind(obs);
        return this.socket.close.bind(this.socket);
      }
    );

    const observer = {
      next: (data: Object) => {
        if (this.socket.readyState === WebSocket.OPEN) {
          this.socket.send(JSON.stringify(data));
        }
      },
    };

    return Subject.create(observer, observable);
  }
}
