import { Component } from "@angular/core";
import { AsyncPipe, DatePipe } from "@angular/common";
import { injectContent, MarkdownComponent } from "@analogjs/content";
import { TalkAttributes } from "../models";
import {
  MatCard,
  MatCardAvatar,
  MatCardHeader,
  MatCardImage,
  MatCardSubtitle,
  MatCardTitle
} from "@angular/material/card";

@Component({
  selector: 'app-talk-details',
  imports: [
    AsyncPipe,
    MarkdownComponent,
    DatePipe,
    MatCard,
    MatCardAvatar,
    MatCardHeader,
    MatCardImage,
    MatCardSubtitle,
    MatCardTitle
  ],
  template: `
  @if (talk$ | async; as talk) {
    <mat-card>
      <mat-card-header>
        <mat-card-title>{{ talk.attributes.title }}</mat-card-title>
        <mat-card-subtitle>{{ talk.attributes.date | date }}</mat-card-subtitle>
        <img matCardAvatar [src]="'images/' + talk.attributes.avatar" />
      </mat-card-header>
      <img mat-card-image [src]="'images/' + talk.attributes.image" />
    </mat-card>
    <analog-markdown [content]="talk.content"></analog-markdown>
  }
  `,
  styles: `
    :host {
        display: block;
        max-width: var(--perko-post-width);
        margin: 0 auto;
    }
  `
})
export default class TalkDetailsPageComponent {
  talk$ = injectContent<TalkAttributes>({
    param: "slug",
    subdirectory: "talks"
  });
}
