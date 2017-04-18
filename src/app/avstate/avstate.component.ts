import { Component, OnInit } from '@angular/core';
import { AvstateService} from './avstate.service';
import { AVState } from '../backend-message';

@Component({
  selector: 'app-avstate',
  templateUrl: './avstate.component.html',
  styleUrls: ['./avstate.component.css']
})

export class AvstateComponent implements OnInit {
  avstate: string;
  error: any;
  constructor(private avstateService: AvstateService) { }

  ngOnInit() {
    this.avstateService.getState()
        .subscribe(val => this.updateState(val),
                   error => this.error = error);
  }

  updateState(state: AVState) {
    this.avstate = state.status.scene;
  }
}
