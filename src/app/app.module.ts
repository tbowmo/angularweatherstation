import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HttpModule } from '@angular/http';
import { RouterModule } from '@angular/router';

import { AppComponent } from './app.component';
import { StreamsComponent } from './streams/streams.component';
import { SensorComponent } from './sensor/sensor.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { ChromeStateComponent } from './chrome-state/chrome-state.component';
import { AvstateComponent } from './avstate/avstate.component';
import { BackendwsService } from './backendws.service';
import { SensorService } from './sensor/sensor.service';
import { ToggleFullScreenDirective } from './toggle-full-screen.directive';
import { SceneComponent } from './scene/scene.component';
import { ConfService } from './conf.service';

@NgModule({
  declarations: [
    AppComponent,
    StreamsComponent,
    SensorComponent,
    DashboardComponent,
    ChromeStateComponent,
    AvstateComponent,
    ToggleFullScreenDirective,
    SceneComponent,
  ],
  imports: [
    BrowserModule,
    FormsModule,
    HttpModule,
    RouterModule.forRoot([
    {path: '', redirectTo: '/dashboard', pathMatch: 'full' },
    {path: 'dashboard',  component : DashboardComponent},
    {path: 'streams', component : StreamsComponent},
    {path: 'scene', component : SceneComponent}
  ])
  ],
  providers: [BackendwsService, SensorService, ConfService ],
  bootstrap: [AppComponent]
})
export class AppModule { }
