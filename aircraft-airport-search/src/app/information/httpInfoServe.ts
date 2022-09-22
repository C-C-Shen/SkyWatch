import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse, HttpHeaders } from '@angular/common/http';
import { of, Observable, forkJoin, tap, catchError, throwError } from 'rxjs';

import _airportLocInformation from '../reference_data/airport-codes.json';
import _airportRunInformation from '../reference_data/runways.json'

import _sampleArr from '../../sample_res/cyow_SampleResArr_9_9_2022.json';
import _sampleDep from '../../sample_res/cyow_SampleResDep_9_9_2022.json';

import _apiAccessKeys from '../../../api-keys.json';

@Injectable({
  providedIn: 'root'
})

export class HttpServe {
  private accessUrl = `?access_key=${_apiAccessKeys.aviationstackKey}`;
  // private paramUrl = `&arr_icao=`
  private airportUrl = 'http://api.aviationstack.com/v1/flights';

  constructor(private http: HttpClient) { }

  getReqAirport(paramSet: string) : Observable<any> {
    // for now, due to limited request numbers, use a sample json file (snapshot)

    console.log("Running with ", paramSet);

    let queryUrl = this.airportUrl + this.accessUrl + `&arr_icao=` + paramSet
    console.log("Requesting: ", queryUrl);

    let getArr = this.http.get<any[]>(queryUrl).pipe(
      tap(data => console.log('ALL: ', JSON.stringify(data))),
      catchError(this.handleError)
    );

    queryUrl = this.airportUrl + this.accessUrl + `&dep_icao=` + paramSet
    console.log("Requesting: ", queryUrl);

    let getDep = this.http.get<any[]>(queryUrl).pipe(
      tap(data => console.log('ALL: ', JSON.stringify(data))),
      catchError(this.handleError)
    );

    return forkJoin({
      arrData: getArr,
      depData: getDep
    });


    // This section is for loading from saved JSON

    // console.log("Using snapshot taken Sept 9, 2022 of CYOW!");
    // let getArr = _sampleArr;
    // let getDep = _sampleDep;

    // return of({'arrData': getArr, 'depData': getDep});


    // return this.http.get<any[]>(this.queryUrl)
    // return this.http.get<any[]>(this.queryUrl).pipe(
    //   tap(data => console.log('ALL: ', JSON.stringify(data))),
    //   catchError(this.handleError)
    // );
  }

  getReqRegInfo(regSearch: string) : Observable<any> {
    let queryUrl = 'http://localhost:3000/acdata?reg=' + regSearch;

    console.log(queryUrl);

    let res = this.http.get<any[]>(queryUrl).pipe(
      tap(data => console.log('ALL: ', JSON.stringify(data))),
      catchError(this.handleError)
    );

    // console.log(res);
    return res;
  }

  getReqRegAircraft(regSearch: string) : Observable<any> {
    const queryUrl = 'https://airlabs.co/api/v9/fleets?hex=' + regSearch + '&api_key=' + _apiAccessKeys.airlabKey;

    console.log(queryUrl);

    let res = this.http.get<any[]>(queryUrl).pipe(
      tap(data => console.log('ALL getReqRegAircraft: ', JSON.stringify(data))),
      catchError(this.handleError)
    );

    // console.log(res);
    return res;
  }

  getIcao24History(icao24Search: string) : Observable<any> {
    // Remeber to replace with with a temporary value when uploading to Git
    const UserName = _apiAccessKeys.openskyUserName;
    const Passwrd = _apiAccessKeys.openskyPassword;

    let end = Math.round((Date.now() / 1000) - (86400 * 1));  // we want to go 1 days before since the API being used does not count anything within 1 days as historic yet.
    console.log(end);
    // let end = 1662768000; // epoch on Sept 10, 2022 (0 hr)
    let begin = end - 86400 * 7;  // 24 * 7 hours previous
    let queryUrl = `https://opensky-network.org/api/flights/aircraft?icao24=` + icao24Search + `&begin=` + begin + `&end=` + end;

    console.log(queryUrl);

    const headers = new HttpHeaders({UserName:Passwrd});
    const requestOptions = { headers: headers };

    let res = this.http.get(queryUrl, requestOptions).pipe(
      tap(data => console.log('ALL: ', JSON.stringify(data))),
      catchError(this.handleError)
    )

    console.log(res);
    return res;
  }

  // get information about airport being displayed
  getAllAirportData(airportToGet: string) : any {
    const foundAirport = _airportLocInformation.find((element: any) => {
      return element.ident === airportToGet.toUpperCase();
    });

    if (foundAirport === undefined) {
      return null;
    } else {
      const foundRunways = _airportRunInformation.filter((element: any) => (element.airport_ident === airportToGet));

      console.log(foundAirport);
      console.log(foundRunways);

      return { location: foundAirport, runways: foundRunways };
    }
  }

  private handleError(err: HttpErrorResponse) {
    // just log to console for now
    let errorMsg = '';
    if (err.error instanceof ErrorEvent) {
      errorMsg = `An error occured: ${err.error.message}`;
    } else {
      errorMsg = `Server returned code: ${err.status}, error message is: ${err.message}`;
    }
    console.error(errorMsg);
    return throwError(() => errorMsg);
  }
}
