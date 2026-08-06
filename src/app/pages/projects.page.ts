import { Component, inject } from "@angular/core";
import { map, of } from "rxjs";
import { ContentService } from "../services/content.service";
import { AsyncPipe, NgOptimizedImage } from "@angular/common";
import { PreviewCardComponent } from "../ui/preview-card.component";
import { ImagePipe } from "../pipes/image.pipe";
import { ProjectSlugPipe } from "../pipes/project-slug.pipe";
import { MatCard, MatCardContent, MatCardHeader, MatCardImage, MatCardTitle } from "@angular/material/card";

@Component({
  selector: 'app-projects',
  imports: [
    NgOptimizedImage,
    AsyncPipe,
    PreviewCardComponent,
    ImagePipe,
    ProjectSlugPipe,
    MatCard,
    MatCardHeader,
    MatCardContent,
    MatCardImage,
    MatCardTitle,
  ],
  template: `
    <mat-card class="info-card">
      <mat-card-header>
        <mat-card-title><h3>Projects &amp; Apps</h3></mat-card-title>
      </mat-card-header>
      <img mat-card-image [ngSrc]="'logo.png' | image" priority width="1524" height="567"
           alt="Chris Perko projects and apps.">
      <mat-card-content>
        <p>Apps and side projects I've built, including Chrome extensions and other tools.</p>
        <p>Each project page includes details, links, and related policies when applicable.</p>
      </mat-card-content>
    </mat-card>
    <section class="projects">
      @for (project of projects$ | async; track project.attributes['title']) {
        <app-preview-card [title]="project.attributes['title']"
                          [subtitle]="project.attributes['type']"
                          [imageUrl]="(project.attributes['image'] || 'logo.png') | image"
                          [avatarUrl]="project.attributes['avatar'] ? (project.attributes['avatar'] | image) : undefined"
                          [linkUrl]="project.slug | projectSlug">
          {{ project.attributes['description'] }}
        </app-preview-card>
      }
    </section>
  `,
  styles: `
    mat-card-title h3 {
      margin: 0 0 1rem 0;
    }

    section.projects {
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
export default class ProjectsPageComponent {
  projects$ = of(inject(ContentService).projects).pipe(
    map(projects => projects.filter(project => !project.attributes['hidden'])),
  );
}
