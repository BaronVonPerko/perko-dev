import { Component } from "@angular/core";
import { AsyncPipe } from "@angular/common";
import { injectContent, MarkdownComponent } from "@analogjs/content";
import { ProjectAttributes } from "../models";
import {
  MatCard,
  MatCardAvatar,
  MatCardHeader,
  MatCardImage,
  MatCardSubtitle,
  MatCardTitle
} from "@angular/material/card";
import { MatAnchor } from "@angular/material/button";
import { RouterLink } from "@angular/router";

@Component({
  selector: 'app-project-details',
  imports: [
    AsyncPipe,
    MarkdownComponent,
    MatCard,
    MatCardAvatar,
    MatCardHeader,
    MatCardImage,
    MatCardSubtitle,
    MatCardTitle,
    MatAnchor,
    RouterLink,
  ],
  template: `
  @if (project$ | async; as project) {
    <mat-card>
      <mat-card-header>
        <mat-card-title>{{ project.attributes.title }}</mat-card-title>
        @if (project.attributes.type) {
          <mat-card-subtitle>{{ project.attributes.type }}</mat-card-subtitle>
        }
        @if (project.attributes.avatar) {
          <img matCardAvatar [src]="'images/' + project.attributes.avatar" alt="" />
        }
      </mat-card-header>
      @if (project.attributes.image) {
        <img mat-card-image [src]="'images/' + project.attributes.image" [alt]="project.attributes.title" />
      }
    </mat-card>
    <p class="privacy-link">
      <a mat-button [routerLink]="['/projects', project.slug, 'privacy']">Privacy Policy</a>
    </p>
    <analog-markdown [content]="project.content"></analog-markdown>
  }
  `,
  styles: `
    :host {
        display: block;
        max-width: var(--perko-post-width);
        margin: 0 auto;
    }

    .privacy-link {
      margin: 1rem 0;
    }
  `
})
export default class ProjectDetailsPageComponent {
  project$ = injectContent<ProjectAttributes>({
    param: "slug",
    subdirectory: "projects"
  });
}
