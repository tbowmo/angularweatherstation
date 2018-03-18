import { Component, OnInit } from '@angular/core';
import { Subscription } from 'rxjs/Subscription';

@Component({
  templateUrl: './house.component.html'
})

export class HouseComponent implements OnInit {
  sub: Subscription;
  errorMessage: any;

  constructor() { }

  ngOnInit() {
  }
}
