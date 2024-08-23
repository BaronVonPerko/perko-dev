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
      <app-social-icon-links />
    </footer>
  `,
  styles: [`
    footer {
      margin-top: 40px;
      border-top: 4px solid var(--color-secondary);
      text-align: center;
    }
  `
  ]
})
export class FooterComponent {
  year = new Date().getFullYear();
}
