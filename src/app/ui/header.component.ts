import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [CommonModule],
  template: `
    <header>
      <img src="/logo.png" alt="logo" />
    </header>
  `,
  styles: [
      `
          header {
              background-color: #1e141f;
          }

          img {
              max-width: 160px;
          }`
  ]
})
export class HeaderComponent {

}
