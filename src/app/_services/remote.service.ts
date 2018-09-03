import { Injectable } from '@angular/core';
import { MqttService } from 'ngx-mqtt';
import { AVScene, ChromeCastStream } from '../_models';
import { Observable, of } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { ConfService } from './conf.service';

@Injectable()
export class RemoteService {
    constructor(
        private mqtt: MqttService,
        private http: HttpClient,
        private conf: ConfService
    ) { }

    public setAVState(state: AVScene) {
        this.mqtt.unsafePublish('avctrl/in/scene', state.mqttName, { retain: false, qos: 2 });
    }

    public getAVScenes(): Observable<AVScene[]> {
        return of(this.conf.getScenes);
    }

    public getStreams(type: string): Observable<ChromeCastStream[]> {
        const url = this.conf.chromeUrl + type + '/list';
        return this.http.get<ChromeCastStream[]>(url);
    }

    public play(stream?: ChromeCastStream) {
        if (stream !== undefined) {
            this.mqtt.unsafePublish('chromecast/play', JSON.stringify(stream), { retain: false, qos: 2 });
        } else {
            this.sendRemoteCmd('play');
        }
    }

    private sendRemoteCmd(cmd: string): void {
        this.mqtt.unsafePublish('avctrl/in/control', cmd, { retain: false, qos: 2 });
    }

    public pause() {
        this.sendRemoteCmd('pause');
    }

    public next() {
        this.sendRemoteCmd('fwd');
    }

    public stop() {
        this.sendRemoteCmd('stop');
    }

    public previous() {
        this.sendRemoteCmd('rev');
    }

    public mute() {
        this.sendRemoteCmd('mute');
    }

    public volumeUp() {
        this.sendRemoteCmd('volumeup');
    }

    public volumeDown() {
        this.sendRemoteCmd('volumedown');
    }
}
