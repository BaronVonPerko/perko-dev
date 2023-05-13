import {Component} from '@angular/core';
import {PageHeaderComponent} from '../ui/page-header.component';

@Component({
    standalone: true,
    imports: [PageHeaderComponent],
    template: `
        <app-page-header>Portfolio</app-page-header>
    `,
    styles: [``],
})
export default class PortfolioComponent {
}