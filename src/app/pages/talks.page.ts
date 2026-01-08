import {Component, inject} from "@angular/core";
import {map, of} from "rxjs";
import {ContentService} from "../services/content.service";
import {AsyncPipe, NgOptimizedImage} from "@angular/common";
import {PreviewCardComponent} from "../ui/preview-card.component";
import {ImagePipe} from "../pipes/image.pipe";
import {TalkSubtitlePipe} from "../pipes/talk-subtitle.pipe";
import {sortTalksByDate} from "../operators";
import {TalkSlugPipe} from "../pipes/talk-slug.pipe";
import {MatCard, MatCardContent, MatCardHeader, MatCardImage, MatCardTitle} from "@angular/material/card";

@Component({
  selector: 'app-talks',
  imports: [NgOptimizedImage, AsyncPipe, PreviewCardComponent, ImagePipe, TalkSubtitlePipe, TalkSlugPipe, MatCard, MatCardHeader, MatCardContent, MatCardImage, MatCardTitle],
  template: `
    <mat-card class="info-card">
      <mat-card-header>
        <mat-card-title><h3>My Talks</h3></mat-card-title>
      </mat-card-header>
      <img mat-card-image [ngSrc]="'perko-brooke-ng-conf.jpg' | image" priority width="600" height="450"
           alt="Chris Perko speaking at a conference.">
      <mat-card-content>
        <p>Here are some of the talks I've given at various conferences and meetups.</p>
        <p>Each one has links to resources, including the slides, and any code samples!</p>
      </mat-card-content>
    </mat-card>
    <section class="talks">
      @for (talk of talks$ | async; track talk.attributes['title']) {
        <app-preview-card [title]="talk.attributes['title']"
                          [subtitle]="talk | talkSubtitle"
                          [imageUrl]="talk.attributes['image'] | image"
                          [avatarUrl]="talk.attributes['avatar'] | image"
                          [linkUrl]="talk.slug | talkSlug">
          {{ talk.attributes['abstract'] }}
        </app-preview-card>
      }
    </section>
  `,
  styles: `
    mat-card-title h3 {
      margin: 0 0 1rem 0;
    }

    section.talks {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(400px, 1fr));
      grid-gap: 0.5rem;

      @media (max-width: 400px) {
        grid-template-columns: repeat(auto-fit, minmax(90%, 1fr));
      }
    }

    .info-card {
      max-width: 600px;
      margin-bottom: 2rem;
    }

    .mdc-card__media {
      object-fit: contain;
    }
  `
})
export default class TalksPageComponent {
  talks$ = of(inject(ContentService).talks).pipe(
    sortTalksByDate(),
    map(talks => talks.filter(talk => !talk.attributes['hidden'])),
  );
}
