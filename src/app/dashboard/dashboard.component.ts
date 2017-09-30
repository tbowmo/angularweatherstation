import { Component, OnInit, OnDestroy } from '@angular/core';
import { TimeoutService } from '../timeout.service';
import { AvstateService } from './avstate.service';
import { AVState } from '../backend-message';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html'
})
export class DashboardComponent implements OnInit, OnDestroy {
  avstate: string;
  error: any;

  constructor(private timeout: TimeoutService,
              private avstateService: AvstateService) { }

  ngOnInit() {
    this.avstateService.getState()
        .subscribe(val => this.updateState(val),
                   error => this.error = error);
   this.timeout.DisableTimeout();
  }

  updateState(state: AVState) {
    this.avstate = state.status.scene;
  }

  ngOnDestroy() {
  }

}
