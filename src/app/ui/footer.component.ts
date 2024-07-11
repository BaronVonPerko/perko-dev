import {Component} from '@angular/core';
import {SocialIconLinksComponent} from './social-icon-links.component';

@Component({
  selector: 'app-footer',
  standalone: true,
  imports: [
    SocialIconLinksComponent
  ],
  template: `
    <footer>
      <p>&copy; {{year}} Perko.DEV</p>
<!--      <app-social-icon-links />-->
    </footer>
  `,
})
export class FooterComponent {
  year = new Date().getFullYear();
}
