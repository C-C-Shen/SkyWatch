import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { MatTableModule } from '@angular/material/table';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatButtonModule} from '@angular/material/button';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

import { AircraftInfo } from './information.aircraft';
import { AirportInfo } from './information.airport';
import { UserInput } from './inputs';
import { MapComponent } from '../map/app.map';


@NgModule({
  declarations: [
    AircraftInfo,
    AirportInfo,
    UserInput,
    MapComponent
  ],
  imports: [
    CommonModule,
    MatTableModule,
    MatExpansionModule,
    MatButtonModule,
    BrowserAnimationsModule,
    RouterModule.forChild([
      { path: 'aircraft/:reg', component: AircraftInfo },
      { path: 'airport/:icao', component: AirportInfo },
    ])
  ],
  exports: [
    UserInput
  ]
})
export class AirportAicraftModule { }
