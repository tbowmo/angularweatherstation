import {
  Component,
  Input,
  OnDestroy,
  OnInit
  } from '@angular/core';
import { MqttMessage, MqttService } from 'ngx-mqtt';
import { Observable } from 'rxjs/Observable';
import { Subscription } from 'rxjs/Subscription';

@Component({
  selector: 'app-sensor',
  template:
  `<div class="sensor s{{size}}">
      <div class="value"><span>{{value|number : precission}}</span></div>
      <div class="label">{{label}} ({{unit}})</div>
  </div>`
})

export class SensorComponent implements OnInit, OnDestroy {
  @Input() id: number;
  @Input() type = 2;
  @Input() label = 'N/A';
  @Input() size = 4;
  @Input() unit = 'N/A';
  @Input() decimals = 1;
  @Input() child: number;
  precission = '1.0-0';
  private filter = '';

  public get observables() {
    return this.mqtt.observables;
  }

  value: number;
  errorMessage: any;
  sensorSubscription: Subscription;

  constructor (private mqtt: MqttService) {
    mqtt.onError.subscribe((e) => console.log('onError', e));
  }

  ngOnInit() {
    if (+this.decimals === 0) {
      this.precission = '1.0-0';
    } else {
      this.precission = '1.1-' + this.decimals;
    }
    if (+this.id === 0) {
      return;
    }
    let child = '+';
    if (this.child !== undefined) {
      child = this.child.toString();
    }
    this.filter = `dashboard/sensors/${this.id}/${child}/1/+/${this.type}`;
    this.sensorSubscription = this.mqtt.observe(this.filter).subscribe((data) => {
      this.value = Number(data.payload);
    });
  }

  ngOnDestroy() {
    this.sensorSubscription.unsubscribe();
    this.mqtt.observables[this.filter] = null;
  }
}
