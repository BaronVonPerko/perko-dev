import {Component, inject} from '@angular/core';
import {PageHeaderComponent} from '../ui/page-header.component';
import {of} from 'rxjs';
import {ContentService} from '../services/content.service';
import {AsyncPipe, NgForOf, NgIf} from '@angular/common';
import {PreviewCardComponent} from '../ui/preview-card.component';
import {ImagePipe} from '../pipes/image.pipe';
import {PillComponent} from '../ui/pill.component';

@Component({
    standalone: true,
    imports: [PageHeaderComponent, AsyncPipe, NgForOf, NgIf, PreviewCardComponent, ImagePipe, PillComponent],
    template: `
        <app-page-header>Portfolio</app-page-header>
        <app-preview-card *ngFor="let portfolio of portfolios$ | async"
                          [title]="portfolio.attributes.title"
                          [imageUrl]="portfolio.attributes.image | image">
            <app-pill>{{portfolio.attributes.type}}</app-pill>
            <p>{{portfolio.attributes.description}}</p>
            <a class="linkbtn" *ngIf="portfolio.attributes.url" href="{{portfolio.attributes.url}}" target="_blank">View Project</a>
        </app-preview-card>
    `,
    styles: [`
    app-pill { display: block; margin: 20px 0;}
    `],
})
export default class PortfolioComponent {
    private content = inject(ContentService);
    portfolios$ = of(this.content.portfolio);
}