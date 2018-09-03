import { Room } from '../_models';
import { ConfService } from './conf.service';
import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { MqttService } from 'ngx-mqtt';

@Injectable()
export class SensorService {

    constructor(
        private mqtt: MqttService,
        private conf: ConfService
    ) { }

    public getRooms(): Observable<Room[]> {
        let data: Room[]
        data = this.conf.getRooms;
        data.map(value => {
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
        return of(data);
    }
}
