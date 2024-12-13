import { Component } from "@angular/core";
import { injectContent, MarkdownComponent } from "@analogjs/content";
import { WorkshopAttributes } from "../models/workshop-attributes";
import { AsyncPipe } from "@angular/common";
import { MatCard, MatCardAvatar, MatCardHeader, MatCardImage, MatCardTitle } from "@angular/material/card";

@Component({
  standalone: true,
  template: `
    @if (workshop$ | async; as workshop) {
      <mat-card>
        <mat-card-header>
          <mat-card-title>{{ workshop.attributes.title }}</mat-card-title>
          <img matCardAvatar [src]="'images/' + workshop.attributes.avatar" />
        </mat-card-header>
        <img mat-card-image [src]="'images/' + workshop.attributes.image" />
      </mat-card>
      <analog-markdown [content]="workshop.content"></analog-markdown>
    }
  `,
  imports: [
    AsyncPipe,
    MarkdownComponent,
    MatCard,
    MatCardAvatar,
    MatCardHeader,
    MatCardImage,
    MatCardTitle
  ],
  styles: `
      :host {
          display: block;
          max-width: var(--perko-post-width);
          margin: 0 auto;
      }
  `
})
export default class WorkshopPage {
  workshop$ = injectContent<WorkshopAttributes>({
    param: "slug",
    subdirectory: "workshops"
  });
}
