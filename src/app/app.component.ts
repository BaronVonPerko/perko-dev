import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import {HeaderComponent} from './ui/header.component';
import {FooterComponent} from './ui/footer.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, HeaderComponent, FooterComponent],
  template: `
      <app-header/>
      <router-outlet></router-outlet>
      <app-footer/>`,
  styles: [
      `:host {
      }`
  ],
})
export class AppComponent {}
