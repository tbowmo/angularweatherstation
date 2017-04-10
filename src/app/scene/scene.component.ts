import { Component, OnInit } from '@angular/core';
import { SceneService, Scene } from './scene.service';
import { Subscription} from 'rxjs/Subscription';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-scene',
  template: `
  <div *ngFor="let sceneData of scenes" class="sensor s3" (click)="play(sceneData)">
      <div class="value {{sceneData.Status}}" >{{sceneData.Name}}</div>
  </div>`,
  providers: [SceneService]
})
export class SceneComponent implements OnInit {
  private errorMessage: any;
  scenes: Scene[];
  sub: Subscription;


  constructor(
    private sceneService: SceneService,
    private route: ActivatedRoute,
    private router: Router
  ) {}

  ngOnInit() {
    this.sub = this.sceneService.getScenes()
        .subscribe(
            scenes => { this.scenes = scenes; },
            error => this.errorMessage = error
          );
  }

  play(scene: Scene) {
    this.sceneService.switchScene(scene).then(() => {
         this.router.navigateByUrl('/dashboard');
     });
  }

}
