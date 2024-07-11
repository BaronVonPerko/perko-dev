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
        @for (portfolio of portfolios$ | async; track portfolio.attributes.title) {
            <app-preview-card [title]="portfolio.attributes.title"
                              [imageUrl]="portfolio.attributes.image | image">
                <app-pill>{{portfolio.attributes.type}}</app-pill>
                <p>{{portfolio.attributes.description}}</p>
                
                @if (portfolio.attributes.url) {
                    <a class="linkbtn" href="{{portfolio.attributes.url}}" target="_blank">View Project</a>
                }
            </app-preview-card>
        }
    `,
    styles: [`
    app-pill { display: block; margin: 20px 0;}
    `],
})
export default class PortfolioComponent {
    private content = inject(ContentService);
    portfolios$ = of(this.content.portfolio);
}
