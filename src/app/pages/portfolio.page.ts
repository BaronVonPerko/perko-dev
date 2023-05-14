import {Component, inject} from '@angular/core';
import {PageHeaderComponent} from '../ui/page-header.component';
import {of} from 'rxjs';
import {ContentService} from '../services/content.service';
import {AsyncPipe, NgForOf} from '@angular/common';
import {PreviewCardComponent} from '../ui/preview-card.component';
import {ImagePipe} from '../pipes/image.pipe';

@Component({
    standalone: true,
    imports: [PageHeaderComponent, AsyncPipe, NgForOf, PreviewCardComponent, ImagePipe],
    template: `
        <app-page-header>Portfolio</app-page-header>
        <app-preview-card *ngFor="let portfolio of portfolios$ | async"
                          [title]="portfolio.attributes.title"
                          [imageUrl]="portfolio.attributes.image | image"
                          [subtitle]="portfolio.attributes.type">
            {{portfolio.attributes.description}}
        </app-preview-card>
    `,
    styles: [``],
})
export default class PortfolioComponent {
    private content = inject(ContentService);
    portfolios$ = of(this.content.portfolio);
}