import { Component, OnInit, OnDestroy } from '@angular/core';
import { TimeoutService } from '../_services';
import { MqttService } from 'ngx-mqtt';
import { Observable ,  Subscription } from 'rxjs';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html'
})

export class DashboardComponent implements OnInit, OnDestroy {
  avstate: string;
  error: any;
  filter: string;
  avstateSubscription: Subscription;

  constructor(private timeout: TimeoutService,
              private mqtt: MqttService) { }

  ngOnInit() {
    this.filter = `avctrl/out/scene`;
    this.avstateSubscription = this.mqtt.observe(this.filter).subscribe((data) => {
      const av = JSON.parse(String(data.payload));
      this.avstate = av.activityName;
    });
   this.timeout.DisableTimeout();
  }

  ngOnDestroy() {
    this.avstateSubscription.unsubscribe();
    this.mqtt.observables[this.filter] = null;
  }

}
