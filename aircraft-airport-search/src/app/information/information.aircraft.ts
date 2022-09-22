import { Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Subscription } from 'rxjs';

import { HttpServe } from './httpInfoServe';

import { flightInfo, coordinates } from '../interfaces/flightInfo';


@Component({
  selector: 'app-aircraftInfo',
  templateUrl: 'information.aircraft.html',
  styleUrls: ['./informationType.css', '../commonStyles.css']
})

export class AircraftInfo {
  sub!: Subscription;
  registration!: string | null;
  imageUrl!: string | null;
  icao24!: string | null;
  historyResults!: any;
  aircraftType!: any;

  flightsArray: flightInfo[] = [];

  panelHistOpenState = false;

  constructor(private router: Router, private _activatedRoute: ActivatedRoute, private _httpGetServe: HttpServe) {
    console.log(this.router.getCurrentNavigation())
  }

  ngOnInit() {
    this.router.routeReuseStrategy.shouldReuseRoute = () => false;  // force page refresh on param change

    this._activatedRoute.params.subscribe(params => {
      this.registration = this._activatedRoute.snapshot.paramMap.get('reg')!.toUpperCase();

      // make request to get image url
      this.sub = this._httpGetServe.getReqRegInfo(this.registration!).subscribe({
        next: data => this.assignValue(data),
        error: err => console.error(err)
      })
    });
  }

  ngOnDestroy(): void {
    this.sub.unsubscribe();
  }

  private assignValue(toAssign: any) {
    console.log(toAssign);
    this.imageUrl = toAssign.photo.url;
    this.icao24 = toAssign.icao24Hex;

    // make request to get ICAO24 Hex history
    this.sub = this._httpGetServe.getIcao24History(this.icao24!).subscribe({
      next: data => {
        this.historyResults = data;
        this.epochToDate();
        this.mapFlights();
        this.getType();
        // console.log(this.historyResults);
      },
      error: err => console.error(err)
    })
  }

  private epochToDate(): void {
    this.historyResults.forEach((element: any) => {
      element.firstSeenDate = new Date(element.firstSeen * 1000);
      element.lastSeenDate = new Date(element.lastSeen * 1000);
    });
  }

  private mapFlights(): void {
    this.setFlightInfo();
  }

  private setFlightInfo(): void {
    this.historyResults.forEach((element: any) => {
      if (element.estArrivalAirport !== null && element.estDepartureAirport !== null) {

        let tempArr = this._httpGetServe.getAllAirportData(element.estArrivalAirport).location;
        // console.log(tempArr);
        if (tempArr === null) {
          console.log(element.estArrivalAirport, " information could not be found, skipping");
          return;
        }
        let arrCoord: coordinates = this.parseAirportCoord(tempArr);

        let tempDep = this._httpGetServe.getAllAirportData(element.estDepartureAirport).location;
        if (tempDep === null) {
          console.log(element.estDepartureAirport, " information could not be found, skipping");
          return;
        }
        let depCoord: coordinates = this.parseAirportCoord(tempDep);

        let toAdd = {
          call: element.callsign,
          start: arrCoord,
          end: depCoord
        }
        this.flightsArray.push(toAdd);
      } else {
        console.log("Skipping due to unknown origin/destination", element);
      }
    });
    // console.log(this.flightsArray);
  }

  private getType() {
    this.sub = this._httpGetServe.getReqRegAircraft(this.icao24!).subscribe({
      next: data => {
        this.aircraftType = data.response;
        if (data) {
          this.hideLoader();
        }
        console.log(this.aircraftType);
      },
      error: err => console.error(err)
    })
  }

  private parseAirportCoord(toParse: any): coordinates {
    let combined = toParse.coordinates.split(',');

    let longCoord = +combined[0];
    let lattCoord = +combined[1];

    let returnCoord: coordinates = {
      name: toParse.ident,
      longitude: longCoord,
      latitude: lattCoord
    };

    return returnCoord;
  }

  private hideLoader() {
    document.getElementById('loading')!.style.display = 'none';
  }
}
