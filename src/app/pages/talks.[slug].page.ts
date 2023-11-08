import {Component} from '@angular/core';
import {AsyncPipe, NgIf} from '@angular/common';
import {injectContent, MarkdownComponent} from '@analogjs/content';
import {PostAttributes, TalkAttributes} from '../models';

@Component({
    standalone: true,
    template: `
        @if (talk$ | async;as talk) {
            <h2>{{ talk.attributes.title }}</h2>
            <img src="images/{{talk.attributes.image}}"/>
            <analog-markdown [content]="talk.content"></analog-markdown>
        }
    `,
    imports: [
        AsyncPipe,
        NgIf,
        MarkdownComponent,
    ],
    styles: [
        `
            h2 {
                max-width: var(--article-width);
                margin: 160px auto 40px;
                border-bottom: 8px solid var(--color-accent);
                padding-bottom: 20px;
            }

            img {
                max-width: var(--article-width);
                margin: 0 auto 40px;
                display: block;
            }
        `
    ]
})
export default class SingleTalkComponent {
    readonly talk$ = injectContent<TalkAttributes>({
        param: 'slug',
        subdirectory: 'talks',
    });
}