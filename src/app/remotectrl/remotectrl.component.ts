import { Component, OnInit, OnDestroy } from '@angular/core';

interface Button {
  text: string;
  icon: string;
  activity:number;
}

@Component({
  selector: 'app-remotectrl',
  templateUrl: './remotectrl.component.html',
  styleUrls: ['./remotectrl.component.css']
})

export class RemotectrlComponent implements OnInit, OnDestroy {
  buttons:Button[];
  constructor() { }

  ngOnInit() {
    this.buttons = Array<Button>();
    this.buttons.push({text:"Vol+", icon:"assets/Media-Controls-Volume-Down-icon.png", activity:10});
    this.buttons.push({text:"Vol-", icon:"assets/Media-Controls-Volume-Up-icon.png", activity:10});
    this.buttons.push({text:"|<<", icon:"assets/Media-Controls-Rewind-icon.png", activity:10});
    this.buttons.push({text:"||", icon:"assets/Media-Controls-Pause-icon.png", activity:10});
    this.buttons.push({text:">>|", icon:"assets/Media-Controls-Forward-icon.png", activity:10});
    this.buttons.push({text:"Power", icon:null, activity:10});

  }

  ngOnDestroy() {

  }
  activate(button: Button) {
    if (this.buttons[3].text == "||") {
      this.buttons[3].text = ">";
      this.buttons[3].icon = "assets/Media-Controls-Play-icon.png";
    } else {
      this.buttons[3].text = "||";
      this.buttons[3].icon = "assets/Media-Controls-Pause-icon.png";
    }

  }
}
