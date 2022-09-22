import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { HttpClientModule } from '@angular/common/http';
import { RouterModule } from '@angular/router';

import { AppComponent } from './app.component';
import { AppHome } from './app.componentHome';
import { AirportAicraftModule } from './information/airport-aicraft.module';

@NgModule({
  declarations: [
    AppComponent,
    AppHome
  ],
  imports: [
    BrowserModule,
    HttpClientModule,
    RouterModule.forRoot([
      { path: 'home', component: AppHome },
      { path: '', redirectTo: 'home', pathMatch: 'full' }, // replace with home page
      { path: '**', redirectTo: 'home', pathMatch: 'full' } // repalce with error page
    ]),
    AirportAicraftModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
