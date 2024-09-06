import { Component, Input } from "@angular/core";
import { CommonModule, NgOptimizedImage } from "@angular/common";
import { BlogSlugPipe } from "../pipes/blog-slug.pipe";
import { ImagePipe } from "../pipes/image.pipe";
import { MatAnchor, MatButton } from "@angular/material/button";
import { RouterLink } from "@angular/router";
import { animate, style, transition, trigger } from "@angular/animations";
import {
    MatCard, MatCardActions,
    MatCardAvatar,
    MatCardHeader,
    MatCardImage,
    MatCardSubtitle,
    MatCardTitle
} from "@angular/material/card";

@Component({
    selector: 'app-preview-card',
    standalone: true,
    imports: [CommonModule, BlogSlugPipe, ImagePipe, MatButton, MatAnchor, RouterLink, MatCard, MatCardHeader, MatCardTitle, MatCardSubtitle, MatCardAvatar, MatCardImage, MatCardActions, NgOptimizedImage],
    animations: [
        trigger('enterLeave', [
            transition(':enter', [
                style({opacity: 0, transform: 'translateY(50px)'}),
                animate('500ms ease-in', style({opacity: 1, transform: 'translateY(0)'})),
            ]),
        ]),
    ],
    template: `
        <mat-card @enterLeave>
            <mat-card-header>
                <mat-card-title>
                    <a [routerLink]="linkUrl"><h4>{{ title }}</h4></a>
                </mat-card-title>
                @if (subtitle) {
                    <mat-card-subtitle>{{ subtitle }}</mat-card-subtitle>
                }
                @if (avatarUrl) {
                    <img mat-card-avatar [ngSrc]="avatarUrl" width="20" height="20" />
                }
            </mat-card-header>
            <img mat-card-image [src]="imageUrl" />
            @if (linkUrl) {
                <mat-card-actions>
                    <a mat-flat-button [routerLink]="linkUrl">{{ linkText }}</a>
                </mat-card-actions>
            }
        </mat-card>
    `,
    styles: `
    mat-card {
        height: 100%;
        justify-content: space-between;
        mat-card-title a {
            h4 {
                margin-top: 0;
                margin-bottom: 1rem;
            }
        }
        mat-card-subtitle {
            margin-bottom: 1rem;
            text-align: var(--perko-card-subtitle-align, left);
        }
    }
    `
})
export class PreviewCardComponent {
    @Input() linkUrl: string | undefined;
    @Input() linkText = 'Read More';
    @Input({required: true}) imageUrl: string | undefined;
    @Input({required: true}) title: string | undefined;
    @Input() subtitle: string | undefined | null;
    @Input() date: string | undefined;
    @Input() avatarUrl: string | undefined;
}
