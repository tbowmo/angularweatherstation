import { Injectable } from '@angular/core';
import { MqttService } from 'ngx-mqtt';
import { AVScene, ChromeCastStream } from '../_models';
import { AVSceneMock } from '../_mocks';
import { Observable } from 'rxjs/Rx';
import { HttpClient } from '@angular/common/http';
import { ConfService } from './conf.service';

@Injectable()
export class RemoteService {
    constructor(
        private mqtt: MqttService,
        private http: HttpClient,
        private conf: ConfService
    ) {}
    public setAVState(state: AVScene) {
        this.mqtt.unsafePublish('avctrl/in/scene', state.mqttName, {retain: false, qos: 2});
    }

    public getAVScenes(): Observable<AVScene[]> {
        return Observable.of(AVSceneMock);
    }

    public getStreams(type: string): Observable<ChromeCastStream[]> {
        const url = this.conf.chromeUrl + type + '/list';
        return this.http.get<ChromeCastStream[]>(url);
    }

    public play(stream?: ChromeCastStream) {
        if (stream !== undefined) {
            this.mqtt.unsafePublish('chromecast/play', JSON.stringify(stream), {retain: false, qos: 2});
        } else {
            this.mqtt.unsafePublish('avctrl/in/control/play', '', {retain: false, qos: 2});
        }
    }

    public pause() {
        this.mqtt.unsafePublish('avctrl/in/control/pause', '');
    }

    public next() {
        this.mqtt.unsafePublish('avctrl/in/control/next', '');
    }

    public previous() {
        this.mqtt.unsafePublish('avctrl/in/control/previous', '');
    }

    public mute() {
        this.mqtt.unsafePublish('avctrl/in/control/mute', '');
    }

    public volumeUp() {
        this.mqtt.unsafePublish('avctrl/in/control/volumeup', '');
    }

    public volumeDown() {
        this.mqtt.unsafePublish('avctrl/in/control/volumedown', '');
    }
}
