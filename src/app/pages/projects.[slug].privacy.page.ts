import { Component } from "@angular/core";
import { AsyncPipe } from "@angular/common";
import { injectContent, MarkdownComponent } from "@analogjs/content";
import { ProjectAttributes } from "../models";
import {
  MatCard,
  MatCardHeader,
  MatCardSubtitle,
  MatCardTitle
} from "@angular/material/card";
import { MatAnchor } from "@angular/material/button";
import { RouterLink } from "@angular/router";

@Component({
  selector: 'app-project-privacy',
  imports: [
    AsyncPipe,
    MarkdownComponent,
    MatCard,
    MatCardHeader,
    MatCardSubtitle,
    MatCardTitle,
    MatAnchor,
    RouterLink,
  ],
  template: `
  @if (privacy$ | async; as privacy) {
    <mat-card>
      <mat-card-header>
        <mat-card-title>{{ privacy.attributes.title }}</mat-card-title>
        @if (privacy.attributes.type) {
          <mat-card-subtitle>{{ privacy.attributes.type }}</mat-card-subtitle>
        }
      </mat-card-header>
    </mat-card>
    <p class="back-link">
      <a mat-button [routerLink]="['/projects', privacy.slug]">Back to project</a>
    </p>
    <article>
      <analog-markdown [content]="privacy.content"></analog-markdown>
    </article>
  }
  `,
  styles: `
    :host {
        display: block;
        max-width: var(--perko-post-width);
        margin: 0 auto;
    }

    .back-link {
      margin: 1rem 0;
    }
  `
})
export default class ProjectPrivacyPageComponent {
  privacy$ = injectContent<ProjectAttributes>({
    param: "slug",
    subdirectory: "project-privacy"
  });
}
