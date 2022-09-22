import { Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Subscription } from 'rxjs';

import { HttpServe } from './httpInfoServe';

import { flightInfo, coordinates } from '../interfaces/flightInfo';

@Component({
  selector: 'app-airportInfo',
  templateUrl: './information.airport.html',
  styleUrls: ['./informationType.css', '../commonStyles.css']
})

export class AirportInfo {
  columnsToDisplay = ['registration', 'type', 'airline', 'flight', 'origin', 'arrTime', 'depTime'];
  panelArrOpenState = false;
  panelDepOpenState = false;

  sub!: Subscription;
  displayedIcao: string = '';
  tableResults!: any;

  mapLocation!: flightInfo;
  airportCoords: number[] = [];
  airportData!: any;

  constructor(private router: Router, private _activatedRoute: ActivatedRoute, private _httpGetServe: HttpServe) {
    console.log(this.router.getCurrentNavigation())
  }

  ngOnInit(): void {
    this.router.routeReuseStrategy.shouldReuseRoute = () => false;  // force page refresh on param change

    this._activatedRoute.params.subscribe(params => {
      this.displayedIcao = this._activatedRoute.snapshot.paramMap.get('icao')!.toUpperCase();

      this.sub = this._httpGetServe.getReqAirport(this.displayedIcao).subscribe({
        next: data => {
          this.setQueryValue(this.customDataParse(data));
          this.processDateTime();
          this.orderFlightData();
          this.getAirportData(this.displayedIcao);
          if (data) {
            this.hideLoader();
          }
        },
        error: err => console.error(err)
      })
    });
  }

  ngOnDestroy(): void {
    this.sub.unsubscribe!();
  }

  private setQueryValue(toSet: any) : void {
    console.log("We got response: ", toSet);
    this.tableResults = toSet;

    console.log("Now display the results!");
  }

  // function for removal of certain elements of the http return
  private customDataParse(toParse: any) : string {
    let toReturn = JSON.parse(JSON.stringify(toParse));

    console.log("Before Parse:", toParse);

    // this will only return the non-codeshared flights (those run by the actual aircraft operator)
    toReturn.arrData = toReturn.arrData.data.filter((element: any) => (element.airline.name !== 'empty' && element.flight.codeshared === null));
    toReturn.depData = toReturn.depData.data.filter((element: any) => (element.airline.name !== 'empty' && element.flight.codeshared === null));

    // console.log("After Parse:", toParse);

    return toReturn;
    // return JSON.stringify(toReturn);
  }

  // get information about airport being displayed
  private getAirportData(airportToGet: string) {
    this.airportData = this._httpGetServe.getAllAirportData(airportToGet);
    console.log(this.airportData);

    let coords = this.airportData.location.coordinates.split(',');
    this.airportCoords.push(coords[0]);
    this.airportCoords.push(coords[1]);

    console.log(this.airportCoords);

    let tempCoords: coordinates = {
      name: this.displayedIcao,
      longitude: coords[0],
      latitude: coords[1]
    }

    let tempLocation: flightInfo = {
      call: "airport",
      start: tempCoords,
      end: tempCoords
    }

    this.mapLocation = tempLocation;

    console.log("Map Location Set: ", this.mapLocation);
  }

  // convert the date time strings into epoch numbers, allows for easier sorting later
  private processDateTime() : void {
    for(var key in this.tableResults) {
      this.tableResults[key].forEach((element: any) => {
        element.arrival.epochArrTime = (Date.parse(element.arrival.scheduled));
        element.arrival.epochEstArrTime = (Date.parse(element.arrival.estimated));
        element.departure.epochDepTime = (Date.parse(element.departure.scheduled));
        element.departure.epochEstDepTime = (Date.parse(element.departure.estimated));

        element.arrival.scheduled = this.dateFormatter(element.arrival.scheduled);
        element.departure.scheduled = this.dateFormatter(element.departure.scheduled);
      });
    }
  }

  // sort flight by epoch times
  private orderFlightData() : void {
    this.tableResults.arrData.sort((a: any, b: any) => (a.arrival.epochArrTime > b.arrival.epochArrTime) ? 1 : -1);
    this.tableResults.depData.sort((a: any, b: any) => (a.departure.epochDepTime > b.departure.epochDepTime) ? 1 : -1);

    // console.log(this.tableResults);
  }

  private dateFormatter(toConvert: string) : string {
    let tempComplete = toConvert.split('T');

    return tempComplete[0] + ' | ' + tempComplete[1].split('+')[0].split(':', 2).join(':');
  }

  private hideLoader() {
    document.getElementById('loading')!.style.display = 'none';
  }
}
