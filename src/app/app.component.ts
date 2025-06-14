import { Component, OnInit } from '@angular/core';
import { RouterOutlet } from '@angular/router';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss',
  standalone: true,
  imports: [RouterOutlet]
})
export class AppComponent implements OnInit {
  readonly title = 'FairWorks';

  ngOnInit(): void {
    // Initialize app-wide services or configurations here
  }
}
