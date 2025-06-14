import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent implements OnInit {
  readonly title = 'FairWorks';

  ngOnInit(): void {
    // Initialize app-wide services or configurations here
  }
}
