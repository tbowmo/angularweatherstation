import { ChromeCastStatus, Room } from '../_models';
import { ChromeCastStream } from '../_models';
import { ConfService } from './conf.service';
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Rx';
import { ReplaySubject } from 'rxjs/ReplaySubject';
import { Subscription } from 'rxjs/Subscription';
import 'rxjs/add/operator/catch';
import 'rxjs/add/operator/map';
import { MqttService } from 'ngx-mqtt';
import { RoomMock } from '../_mocks/room-mock';

@Injectable()
export class SensorService {

    constructor(
        private mqtt: MqttService
    ) {}

    public getRooms(): Observable<Room[]> {
        RoomMock.map(value => {
            const temp = `dashboard/sensors/${value.sensorId}/+/+/+/0`;
            const humidity = `dashboard/sensors/${value.sensorId}/+/+/+/1`;
            this.mqtt.observe(temp).first().subscribe((result) => {
                value.temperature = Number(result.payload.toString());
            });
            this.mqtt.observables[temp] = null;
            this.mqtt.observe(humidity).first().subscribe((result) => {
                value.humidity = Number(result.payload.toString());
            });
            this.mqtt.observables[humidity] = null;
            this.mqtt.observe(temp + '/time').first().subscribe((result) => {
                value.timestamp = new Date(Number(result.payload.toString()) * 1000);
            });
            this.mqtt.observables[temp + '/time'] = null;
        });
        return Observable.of(RoomMock);
    }
}
