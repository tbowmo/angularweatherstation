import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { RouterModule } from '@angular/router';

import { AppComponent } from './app.component';
import { StreamsComponent } from './streams/streams.component';
import { SensorComponent } from './sensor/sensor.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { ChromeStateComponent } from './chrome-state/chrome-state.component';
import { BackendwsService } from './_services';
import { SceneComponent } from './scene/scene.component';
import { ConfService } from './_services';
import { HouseComponent } from './house/house.component';
import { TruncatePipe } from './_pipes';
import { TruncateHeadPipe } from './_pipes';
import { TimeoutService } from './_services';
import { RemotectrlComponent } from './remotectrl/remotectrl.component';
import { ChromeCastService } from './_services';
import { LOCALE_ID } from '@angular/core';
import { MqttService, MqttModule } from 'ngx-mqtt';
import { environment } from 'environments/environment';

@NgModule({
  declarations: [
    AppComponent,
    StreamsComponent,
    SensorComponent,
    DashboardComponent,
    ChromeStateComponent,
    SceneComponent,
    HouseComponent,
    TruncatePipe,
    TruncateHeadPipe,
    RemotectrlComponent,
  ],
  imports: [
    BrowserModule,
    FormsModule,
    HttpClientModule,
    RouterModule.forRoot([
    {path: '', redirectTo: 'dashboard', pathMatch: 'full' },
    {path: 'dashboard',  component: DashboardComponent},
    {path: 'streams/:device', component: StreamsComponent},
    {path: 'scene', component: SceneComponent},
    {path: 'house', component: HouseComponent},
    {path: '**', redirectTo: 'dashboard'}
  ]),
  MqttModule.forRoot({
    provide: MqttService,
    useFactory: mqttServiceFactory
  })
  ],
  providers: [ /*{provide: LOCALE_ID, useValue: "da"},*/
  BackendwsService, ConfService, TimeoutService, ChromeCastService ],
  bootstrap: [AppComponent]
})
export class AppModule { }

export function mqttServiceFactory() {
  return new MqttService(environment.MQTT_SERVICE_OPTIONS);
}
