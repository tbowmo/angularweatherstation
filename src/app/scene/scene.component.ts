import { Component, OnInit } from '@angular/core';
import { DomoticzService, Device } from '../domoticz.service';
import { Subscription} from 'rxjs/Subscription';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-scene',
  template: `
  <div *ngFor="let sceneData of scenes" class="sensor s3" (click)="play(sceneData)">
      <div class="value {{sceneData.Status}}" >{{sceneData.Name | truncateHead}}</div>
  </div>`,
  providers: [DomoticzService]
})
export class SceneComponent implements OnInit {
  private errorMessage: any;
  scenes: Device[];
  sub: Subscription;


  constructor(
    private sceneService: DomoticzService,
    private route: ActivatedRoute,
    private router: Router
  ) {}

  ngOnInit() {
    this.sub = this.sceneService.getDomoticzPlan(2, "harmony")
        .subscribe(
            scenes => { this.scenes = scenes; },
            error => this.errorMessage = error
          );
  }

  play(scene: Device) {
    this.sceneService.switchScene(scene).then(() => {
         this.router.navigateByUrl('/dashboard');
     });
  }

}
