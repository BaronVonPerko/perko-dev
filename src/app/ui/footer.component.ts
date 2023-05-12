import {Component} from '@angular/core';

@Component({
  selector: 'app-footer',
  standalone: true,
  imports: [],
  template: `
    <footer>
      <p>&copy; {{year}} Perko.DEV</p>
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
