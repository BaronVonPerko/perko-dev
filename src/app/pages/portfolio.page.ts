import {Component, inject} from "@angular/core";
    import { of } from "rxjs";
    import { AsyncPipe} from "@angular/common";
    import { PreviewCardComponent } from "../ui/preview-card.component";
    import { ImagePipe } from "../pipes/image.pipe";

@Component({
  selector: 'app-portfolio-page',
  imports: [AsyncPipe, PreviewCardComponent, ImagePipe],
  template: `
    <section class="cards">
      @for (portfolio of portfolios$ | async; track portfolio.attributes['title']) {
        <app-preview-card [title]="portfolio.attributes['title']"
                          [linkUrl]="portfolio.attributes['url']"
                          linkText="View Project"
                          [imageUrl]="portfolio.attributes['image'] | image">
        </app-preview-card>
      }
    </section>
  `,
  styles: `
    section.cards {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(400px, 1fr));
      grid-gap: 0.5rem;
    }
  `
})
export default class PortfolioPageComponent {
  portfolios$ = of(inject(ContentService).portfolio);
}
