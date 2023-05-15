import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-pill',
  standalone: true,
  imports: [CommonModule],
  template: `
    <span><ng-content /></span>
  `,
  styles: [
      `
      span {
        padding: 10px 20px;
        margin-right: 20px;
        background-color: var(--color-accent);
        color: white;
      }
      `
  ]
})
export class PillComponent {

}
