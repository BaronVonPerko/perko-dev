import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-control-buttons',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="circles">
      <span class="circle"></span><span class="circle"></span><span class="circle"></span>
    </div>
  `,
  styles: [`
    .circles {
      position: absolute;
      top: 16px;
      right: 16px;
    }

    .circles .circle {
      display: inline-block;
      width: 16px;
      height: 16px;
      border-radius: 50%;
      border: 2px solid var(--color-secondary);
      margin: 0 5px;
    }
  `]
})
export class ControlButtonsComponent {

}
