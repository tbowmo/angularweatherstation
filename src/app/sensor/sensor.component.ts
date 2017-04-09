import { Component, OnInit, Input, OnDestroy } from '@angular/core';
import { SensorService } from './sensor.service';
import { Sensor } from '../backend-message';
import { Subscription } from 'rxjs/Subscription';

@Component({
  selector: 'app-sensor',
  templateUrl: './sensor.component.html',
  styleUrls: ['./sensor.component.css']
})

export class SensorComponent implements OnInit, OnDestroy {
  @Input() id: number;
  @Input() type = 2;
  @Input() label = 'N/A';
  @Input() size = 4;
  @Input() unit = 'N/A';
  value = 0;
  errorMessage: any;
  sensorSubscription: Subscription;

  constructor (private sensorService: SensorService) { }

  ngOnInit() {
    if (+this.id === 0) {
      return;
    }
    this.sensorSubscription = this.sensorService.sensorsStream
      .subscribe(
        val => this.handleSensor(val),
        error => this.errorMessage = <any>error
      );
    this.sensorService.fetchSensor(this.id, this.type);
  }

  ngOnDestroy() {
    if (this.sensorSubscription !== undefined) {
      this.sensorSubscription.unsubscribe();
    }
  }

  handleSensor(message: any) {
    message = message as Sensor;
    if (+message.nodeId === +this.id && +message.subType === +this.type) {
      this.value = +message.payload;
    }
  }
}
