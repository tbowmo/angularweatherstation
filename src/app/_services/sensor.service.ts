import { ChromeCastStatus, Room } from '../_models';
import { ChromeCastStream } from '../_models';
import { ConfService } from './conf.service';
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { ReplaySubject ,  Subscription } from 'rxjs';


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
            const timestamp = `dashboard/timestamp/${value.sensorId}/+/+/+/0`;
            this.mqtt.observe(temp).subscribe((result) => {
                value.temperature = Number(result.payload.toString());
            });
            this.mqtt.observables[temp] = null;
            this.mqtt.observe(humidity).subscribe((result) => {
                value.humidity = Number(result.payload.toString());
            });
            this.mqtt.observables[humidity] = null;
            this.mqtt.observe(timestamp).subscribe((result) => {
                value.timestamp = new Date(Number(result.payload.toString()));
            });
            this.mqtt.observables[timestamp] = null;
        });
        return of(RoomMock);
    }
}
