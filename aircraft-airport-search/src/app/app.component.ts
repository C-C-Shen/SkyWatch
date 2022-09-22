import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-root',
  template: `
  <div class='nav-logo'>
    <a routerLink='/home'>
      <img src="assets/images/Logo.png" class='mainLogo'>
    </a>
  </div>
  <router-outlet></router-outlet>
  `,
  styleUrls: ['./commonStyles.css']
})

export class AppComponent implements OnInit {

  ngOnInit(): void {
    console.log("Started!")
  }
}
