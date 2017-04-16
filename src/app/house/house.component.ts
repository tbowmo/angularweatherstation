import { Component, OnInit } from '@angular/core';
import { DomoticzService, Device } from '../domoticz.service';
import { Subscription } from 'rxjs/Subscription';

@Component({
  templateUrl: './house.component.html',
  styleUrls: ['./house.component.css'],
  providers: [ DomoticzService ]
})

export class HouseComponent implements OnInit {
  sensors: Device[];
  sub: Subscription;
  errorMessage: any;

  constructor( private domoticz: DomoticzService) { }

  ngOnInit() {
    this.sub = this.domoticz.getDomoticzPlan(4, 'MySensorNet')
        .subscribe(
            devices => { this.sensors = devices; },
            error => this.errorMessage = error
          );
  }
}
