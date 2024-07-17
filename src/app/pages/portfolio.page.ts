import {Component, inject} from '@angular/core';
import {of} from 'rxjs';
import {ContentService} from '../services/content.service';
import {AsyncPipe, NgForOf, NgIf} from '@angular/common';
import {PreviewCardComponent} from '../ui/preview-card.component';
import {ImagePipe} from '../pipes/image.pipe';
import {PillComponent} from '../ui/pill.component';

@Component({
    standalone: true,
    imports: [AsyncPipe, NgForOf, NgIf, PreviewCardComponent, ImagePipe, PillComponent],
    template: `
        <section class="cards">
        @for (portfolio of portfolios$ | async; track portfolio.attributes.title) {
            <app-preview-card [title]="portfolio.attributes.title"
                              [linkUrl]="portfolio.attributes.url"
                              linkText="View Project"
                              [imageUrl]="portfolio.attributes.image | image">
            </app-preview-card>
        }
        </section>
    `,
    styles: `
        section.cards {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(400px, 1fr));
            grid-gap: 1rem;
        }
    `
})
export default class PortfolioComponent {
    private content = inject(ContentService);
    portfolios$ = of(this.content.portfolio);
}
