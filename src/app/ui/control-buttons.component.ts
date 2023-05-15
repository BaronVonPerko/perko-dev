import {Component} from '@angular/core';

@Component({
  selector: 'app-control-buttons',
  standalone: true,
  imports: [],
  template: `
    <div class="circles">
      <span class="circle"></span><span class="circle"></span><span class="circle"></span>
    </div>
  `,
  styles: [`
    .circles {
      width: 100%;
      margin: 20px 0;
      display: flex;
      justify-content: end;
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
export class ControlButtonsComponent { }
