import { Component, OnInit, Input, OnDestroy } from '@angular/core';
import { MqttService } from 'ngx-mqtt';
import { Subscription } from 'rxjs';
import { LightState} from '../_models';

@Component({
  selector: 'app-light-dimmer',
  templateUrl: './light-dimmer.component.html'
})
export class LightDimmerComponent implements OnInit, OnDestroy {
  sliderDisable = true;
  state: LightState = {brightness: 100, on: true};
  stateSubscription: Subscription;

  @Input()
  light = 'none';

  @Input()
  label = 'defineme';

  constructor(private mqtt: MqttService ) {}

  ngOnInit() {
    this.stateSubscription = this.mqtt.observe(`light/${this.light}/state`).subscribe((msg) => {
      const payload = msg.payload.toString();
      if (payload !== 'status') {
        this.state = JSON.parse(payload) as LightState;
        this.sliderDisable = !this.state.on;
      }
    });
    this.mqtt.unsafePublish(`light/${this.light}/state`, 'status');
  }

  ngOnDestroy() {
    this.stateSubscription.unsubscribe();
    this.mqtt.observables[`light/${this.light}/state`] = null;
  }

  toggle(event) {
    this.state.on = event.checked;
    this.sliderDisable = !this.state.on;
    this.transmit();
  }

  slide(event) {
    this.state.brightness = event.value;
    this.transmit();
  }

  transmit() {
    console.log(this.state);
    console.log(this.light);
    this.mqtt.unsafePublish(`light/${this.light}/set`, JSON.stringify(this.state), {qos: 2, retain: false});
  }
}
