import { Component, inject } from "@angular/core";
import { PreviewCardComponent } from "../ui/preview-card.component";
import { AsyncPipe } from "@angular/common";
import { ImagePipe } from "../pipes/image.pipe";
import { WorkshopSlugPipe } from "../pipes/workshop-slug.pipe";
import { map, of } from "rxjs";
import { ContentService } from "../services/content.service";

@Component({
  standalone: true,
  template: `
    <h1>Workshops</h1>
    <section class="workshops">
      @for (workshop of workshops$ | async; track workshop.attributes.title) {
        <app-preview-card [title]="workshop.attributes.title"
                          [imageUrl]="workshop.attributes.image | image"
                          [avatarUrl]="workshop.attributes.avatar | image"
                          [linkUrl]="workshop.slug | workshopSlug" />
      }
    </section>
  `,
  imports: [
    PreviewCardComponent,
    AsyncPipe,
    ImagePipe,
    WorkshopSlugPipe
  ],
  styles: `
      :host {
          --perko-card-subtitle-align: right;
      }

      img {
          width: 60px;
          height: 60px;
          transition: transform 0.2s;

          &:hover {
              transform: rotate(10deg);
          }
      }

      section.workshops {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
          grid-gap: 0.5rem;

          @media (max-width: 400px) {
              grid-template-columns: repeat(auto-fit, minmax(90%, 1fr));
          }
      }
  `
})
export default class WorkshopsPage {
  workshops$ = of(inject(ContentService).workshops).pipe(
    map(workshop => workshop.filter(talk => !talk.attributes.hidden)),
  );
}
