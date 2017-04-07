import { Component, OnInit } from '@angular/core';
import { AvstateService, IAvstate} from './avstate.service';

@Component({
  selector: 'app-avstate',
  templateUrl: './avstate.component.html',
  styleUrls: ['./avstate.component.css'],
  providers : [AvstateService]
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

  updateState(state: IAvstate) {
    this.avstate = state.status.scene;
  }
}
