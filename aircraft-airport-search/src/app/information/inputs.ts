import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-inputs',
  template: `
  <div class='inputs'>
    <input placeholder='Enter ICAO'  type='string' id='identity' name='identity' value=''>
    &ensp;<button class='inputButton' (click)="airportSearchClicked()">Airport Search</button>
    &ensp;<button class='inputButton' (click)="regSearchClicked()">Registration Search</button>
  </div>
  `,
  styleUrls: ['./informationType.css', '../commonStyles.css']
})

export class UserInput {
  tableResults: any;

  constructor(private router: Router) {
    this.router.routeReuseStrategy.shouldReuseRoute = () => false;  // force page refresh on param change
  }

  airportSearchClicked() {
    var toSet = document.getElementById('identity') as HTMLInputElement;

    console.log("Values to route:", toSet.value);
    if (toSet.value !== "") {
      this.router.navigate(['/airport', toSet.value]);
    } else {
      console.log("Make sure input is not empty");
    }
  }

  regSearchClicked() {
    var toSet = document.getElementById('identity') as HTMLInputElement;

    console.log("Values to route:", toSet.value);
    if (toSet.value !== "") {
      this.router.navigate(['/aircraft', toSet.value]);
    } else {
      console.log("Make sure input is not empty");
    }
  }
}
