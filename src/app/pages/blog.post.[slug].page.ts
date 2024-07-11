import { Component } from "@angular/core";
import { injectContent, MarkdownComponent } from "@analogjs/content";
import { PostAttributes } from "../models";
import { AsyncPipe, DatePipe, NgIf } from "@angular/common";
import { MatCardModule } from "@angular/material/card";

@Component({
    standalone: true,
    imports: [AsyncPipe, NgIf, MarkdownComponent, MatCardModule, DatePipe],
    template: `
        @if (post$ | async; as post) {
            <mat-card>
                <mat-card-header>
                    <mat-card-title>{{post.attributes.title}}</mat-card-title>
                    <mat-card-subtitle>{{post.attributes.date | date}}</mat-card-subtitle>
                    <img matCardAvatar [src]="'images/' + post.attributes.avatar" />
                </mat-card-header>
                <img mat-card-image [src]="'images/' + post.attributes.image" />
            </mat-card>
            
            <analog-markdown [content]="post.content"></analog-markdown>
        }
    `,
    styles: `
    :host {
        display: block;
        max-width: var(--post-width);
        padding: 0 16px;
        margin: 0 auto;
    }
    analog-markdown {
        line-height: 1.5;
    }
    `
})
export default class PostPageComponent {
    readonly post$ = injectContent<PostAttributes>({
        param: 'slug',
        subdirectory: 'posts',
    });
}
