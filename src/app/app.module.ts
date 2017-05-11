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
import { SceneComponent } from './scene/scene.component';
import { ConfService } from './conf.service';
import { HouseComponent } from './house/house.component';
import { TruncatePipe } from './truncate.pipe';
import { TruncateHeadPipe } from './truncate-head.pipe';
import { TimeoutService } from './timeout.service';
import { RemotectrlComponent } from './remotectrl/remotectrl.component';
import { ChromeCastService } from './chrome-cast.service';
import { DomoticzService } from './domoticz.service';
import { AvstateService } from './avstate/avstate.service'
@NgModule({
  declarations: [
    AppComponent,
    StreamsComponent,
    SensorComponent,
    DashboardComponent,
    ChromeStateComponent,
    AvstateComponent,
    SceneComponent,
    HouseComponent,
    TruncatePipe,
    TruncateHeadPipe,
    RemotectrlComponent,
  ],
  imports: [
    BrowserModule,
    FormsModule,
    HttpModule,
    RouterModule.forRoot([
    {path: '', redirectTo: 'dashboard', pathMatch: 'full' },
    {path: 'dashboard',  component: DashboardComponent},
    {path: 'streams/:device', component: StreamsComponent},
    {path: 'scene', component: SceneComponent},
    {path: 'house', component: HouseComponent},
    {path: '**', redirectTo: 'dashboard'}
  ])
  ],
  providers: [BackendwsService, SensorService, ConfService, TimeoutService, ChromeCastService, DomoticzService, AvstateService ],
  bootstrap: [AppComponent]
})
export class AppModule { }
