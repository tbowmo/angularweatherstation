import { APP_INITIALIZER } from '@angular/core';
import { BrowserModule, DomSanitizer } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { RouterModule } from '@angular/router';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';

import { AppComponent } from './app.component';
import { TabStreamsComponent } from './tab-streams/tab-streams.component';
import { SensorComponent } from './sensor/sensor.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { ChromeStateComponent } from './chrome-state/chrome-state.component';
import { TabSceneComponent } from './tab-scene/tab-scene.component';
import { ConfService } from './_services';
import { TabHouseComponent } from './tab-house/tab-house.component';
import { TruncatePipe } from './_pipes';
import { TruncateHeadPipe } from './_pipes';
import { TimeoutService } from './_services';
import { RemotectrlComponent } from './remotectrl/remotectrl.component';
import { ChromeCastService } from './_services';
import { MqttModule } from 'ngx-mqtt';
import { environment } from 'environments/environment';
import { RemoteService } from './_services';
import { SensorService } from './_services';
import { MomentModule } from 'ngx-moment';
import { MatIconModule, MatIconRegistry, MatSliderModule, MatSlideToggleModule } from '@angular/material';
import { MatCardModule } from '@angular/material';
import { LightDimmerComponent } from './light-dimmer/light-dimmer.component';
import { TabLightsComponent } from './tab-lights/tab-lights.component';
import { LightMoodComponent } from './light-mood/light-mood.component';

@NgModule({
  declarations: [
    AppComponent,
    TabStreamsComponent,
    SensorComponent,
    DashboardComponent,
    ChromeStateComponent,
    TabSceneComponent,
    TabHouseComponent,
    TruncatePipe,
    TruncateHeadPipe,
    RemotectrlComponent,
    LightDimmerComponent,
    TabLightsComponent,
    LightMoodComponent
  ],
  imports: [
    MomentModule,
    FontAwesomeModule,
    MatIconModule,
    MatSliderModule,
    MatSlideToggleModule,
    MatCardModule,
    BrowserModule,
    FormsModule,
    HttpClientModule,
    RouterModule.forRoot([
      {path: '', redirectTo: 'dashboard', pathMatch: 'full' },
      {path: 'dashboard',  component: DashboardComponent},
      {path: 'streams/:device', component: TabStreamsComponent},
      {path: 'scene', component: TabSceneComponent},
      {path: 'house', component: TabHouseComponent},
      {path: 'lights', component: TabLightsComponent},
      {path: '**', redirectTo: 'dashboard'}
    ]),
    MqttModule.forRoot(environment.MQTT_SERVICE_OPTIONS)
  ],
  providers: [ /*{provide: LOCALE_ID, useValue: "da"},*/
    ConfService,
    { provide: APP_INITIALIZER, useFactory: ConfFactory , deps: [ConfService], multi: true },
    TimeoutService,
    ChromeCastService,
    RemoteService,
    SensorService,
   ],
  bootstrap: [AppComponent]
})
export class AppModule {
  constructor(matIconRegistry: MatIconRegistry, domSanitizer: DomSanitizer) {
    matIconRegistry.addSvgIconSet(domSanitizer.bypassSecurityTrustResourceUrl('./assets/mdi.svg'));
    // Or whatever path you placed mdi.svg at
  }
}

export function ConfFactory(config: ConfService) {
   return () => config.loadConfig()
}
