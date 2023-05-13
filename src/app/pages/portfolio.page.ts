import {Component, inject} from '@angular/core';
import {PageHeaderComponent} from '../ui/page-header.component';
import {of} from 'rxjs';
import {ContentService} from '../services/content.service';
import {AsyncPipe, NgForOf} from '@angular/common';

@Component({
    standalone: true,
    imports: [PageHeaderComponent, AsyncPipe, NgForOf],
    template: `
        <app-page-header>Portfolio</app-page-header>
        <p *ngFor="let portfolio of portfolios$ | async">
            {{ portfolio.attributes.title }}
        </p>
    `,
    styles: [``],
})
export default class PortfolioComponent {
    private content = inject(ContentService);
    portfolios$ = of(this.content.portfolio);
}