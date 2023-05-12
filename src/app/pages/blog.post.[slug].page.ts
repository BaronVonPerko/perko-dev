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
    `
})
export default class PostPageComponent {
    readonly post$ = injectContent<PostAttributes>({
        param: 'slug',
        subdirectory: 'posts',
    });
}
