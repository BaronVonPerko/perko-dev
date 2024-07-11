import {Component} from '@angular/core';
import {injectContent} from '@analogjs/content';
import {PostAttributes} from '../models';
import {AsyncPipe, NgIf} from '@angular/common';
import {MarkdownComponent} from '@analogjs/content';

@Component({
    standalone: true,
    imports: [AsyncPipe, NgIf, MarkdownComponent],
    template: `
        @if (post$ | async; as post) {
            <h2>{{ post.attributes.title }}</h2>
            <img src="images/{{post.attributes.image}}"/>
            <analog-markdown [content]="post.content"></analog-markdown>
        }
    `,
    styles: `
    :host {
        display: block;
        max-width: var(--post-width);
        padding: 0 16px;
        margin: 0 auto;
        
        img {
            max-width: 100%;
            margin: 0 auto;
            display: block;
        }
    }
    `
})
export default class PostPageComponent {
    readonly post$ = injectContent<PostAttributes>({
        param: 'slug',
        subdirectory: 'posts',
    });
}
