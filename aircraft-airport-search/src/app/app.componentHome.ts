import { Component } from '@angular/core';

import _airportInformation from './reference_data/airport-codes.json';

@Component({
  selector: 'app-home',
  templateUrl: 'componentHome.html',
  styleUrls: ['./componentHome.css', './commonStyles.css']
})

export class AppHome {
  randomAirports: any[] = [];

  ngOnInit(): void {
    let i = 0;
    while (i < 20) {
      let nextAdd = _airportInformation[Math.floor(Math.random() * _airportInformation.length)];

      // only select airports that really get traffic
      if (nextAdd.type == 'large_airport') {
        this.randomAirports.push(nextAdd);
        i++;
      }
    }

    console.log(this.randomAirports);
  }
}
