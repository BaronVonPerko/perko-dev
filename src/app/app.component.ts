import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import {HeaderComponent} from './ui/header.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, HeaderComponent],
  template: ` 
    <app-header/>
    <router-outlet></router-outlet> `,
  styles: [
      `:host {
      }`
  ],
})
export class AppComponent {}
