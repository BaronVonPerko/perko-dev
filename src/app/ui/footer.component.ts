import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-footer',
  standalone: true,
  imports: [CommonModule],
  template: `
    <footer>
      <p>&copy;{{year}} Perko.DEV</p>
    </footer>
  `,
  styles: [`
    footer {
      margin-top: 40px;
      border-top: 4px solid var(--color-accent);
      text-align: center;
    }
  `
  ]
})
export class FooterComponent {
  year = new Date().getFullYear();
}
