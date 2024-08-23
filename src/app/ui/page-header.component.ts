import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-page-header',
  standalone: true,
  imports: [CommonModule],
  template: `
    <h1><ng-content /></h1>
  `,
  styles: [
      `
          h1 {
              max-width: var(--max-page-width);
              margin: 40px auto 80px;
          }
      `
  ]
})
export class PageHeaderComponent {

}
