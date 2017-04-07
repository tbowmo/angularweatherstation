import { Component, OnInit, Input, OnDestroy } from '@angular/core';
import { SensorService } from './sensor.service';
import { Sensor } from '../backend-message';

@Component({
  selector: 'sensor',
  templateUrl: './sensor.component.html',
  styleUrls: ['./sensor.component.css'],
  providers: [SensorService]
})

export class SensorComponent implements OnInit, OnDestroy {
  @Input() id: number;
  @Input() type = 2;
  @Input() label = 'N/A';
  @Input() size = 4;
  @Input() unit = 'N/A';
  value = 0;
  errorMessage: any;
  ss : any;
  constructor (private sensorService: SensorService) { }

  ngOnInit() {
      this.ss = this.sensorService.sensor(this.id, this.type)
        .subscribe(val => this.handleSensor(val), error => this.errorMessage = <any>error);
  }

  ngOnDestroy() {
    this.ss.unsubscribe();
  }

  handleSensor(message: any) {
    if (message[0] !== undefined) {
      this.value = +message[0].last;
    } else {
      message = message as Sensor;
      if (message.nodeId === this.id && message.subType === this.type) {
        this.value = +message.payload;
      }
    }
  }
}
