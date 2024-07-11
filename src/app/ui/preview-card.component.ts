import { Component, Input } from "@angular/core";
import { CommonModule } from "@angular/common";
import { BlogSlugPipe } from "../pipes/blog-slug.pipe";
import { ControlButtonsComponent } from "./control-buttons.component";
import { ImagePipe } from "../pipes/image.pipe";
import { MatCardModule } from "@angular/material/card";
import { MatAnchor, MatButton } from "@angular/material/button";
import { RouterLink } from "@angular/router";

@Component({
    selector: 'app-preview-card',
    standalone: true,
    imports: [CommonModule, BlogSlugPipe, ControlButtonsComponent, ImagePipe, MatCardModule, MatButton, MatAnchor, RouterLink],
    template: `
      <mat-card appearance="outlined">
        <mat-card-header>
          <mat-card-title>{{ title }}</mat-card-title>
          @if (subtitle) {
            <mat-card-subtitle>{{ subtitle }}</mat-card-subtitle>
          }
          @if (avatarUrl) {
            <img mat-card-avatar [src]="avatarUrl" />
          }
        </mat-card-header>
        <img mat-card-image [src]="imageUrl" />
        <mat-card-actions>
          <a mat-raised-button [routerLink]="linkUrl">Read More</a>
        </mat-card-actions>
      </mat-card>
    `,
    styles: `
    mat-card {
        height: 100%;
        justify-content: space-between;
    }
    `
})
export class PreviewCardComponent {
    @Input() linkUrl: string | undefined;
    @Input({required: true}) imageUrl: string | undefined;
    @Input({required: true}) title: string | undefined;
    @Input() subtitle: string | undefined | null;
    @Input() date: string | undefined;
    @Input() avatarUrl: string | undefined;
}
