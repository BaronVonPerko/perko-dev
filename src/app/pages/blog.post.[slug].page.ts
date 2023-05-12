import {Component} from '@angular/core';
import {injectContent} from '@analogjs/content';
import {PostAttributes} from '../models';
import {AsyncPipe, NgIf} from '@angular/common';
import {MarkdownComponent} from '@analogjs/content';

@Component({
    standalone: true,
    imports: [AsyncPipe, NgIf, MarkdownComponent],
    template: `
        <ng-container *ngIf="post$ | async as post">
            <h2>{{ post.attributes.title }}</h2>
            <analog-markdown [content]="post.content"></analog-markdown>
        </ng-container>
    `,
    styles: [
        `
            h2 {
                max-width: var(--article-width);
                margin: 160px auto 0;
                border-bottom: 8px solid var(--color-accent);
                padding-bottom: 20px;
            }
        `],
})
export default class PostPageComponent {
    readonly post$ = injectContent<PostAttributes>({
        param: 'slug',
        subdirectory: 'posts',
    });
}
