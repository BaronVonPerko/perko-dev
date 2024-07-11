import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatToolbar } from "@angular/material/toolbar";

@Component({
  selector: 'app-page-header',
  standalone: true,
  imports: [CommonModule, MatToolbar],
  template: `
    <mat-toolbar>
    <ng-content />
    </mat-toolbar>
  `,
})
export class PageHeaderComponent {

}
