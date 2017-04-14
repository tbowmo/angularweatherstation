import { Component, OnInit, OnDestroy } from '@angular/core';
import { TimeoutService } from '../timeout.service';
@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit, OnDestroy {

  constructor(private timeout: TimeoutService) { }

  ngOnInit() {
    this.timeout.DisableTimeout();
  }

  ngOnDestroy() {
    this.timeout.SetTimeout();
  }

}
