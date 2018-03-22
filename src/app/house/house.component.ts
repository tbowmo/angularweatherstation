import { Component, OnInit } from '@angular/core';
import { SensorService } from '../_services';
import { Observable } from 'rxjs/Rx';
import { Room } from '../_models';

@Component({
  templateUrl: './house.component.html'
})

export class HouseComponent implements OnInit {
  errorMessage: any;
  rooms: Observable<Room[]>;

  constructor(
    private sensors: SensorService
  ) { }

  ngOnInit() {
    this.rooms = this.sensors.getRooms();
  }
}
