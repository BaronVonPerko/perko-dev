import { injectContent, MarkdownComponent } from '@analogjs/content';
import { AsyncPipe, NgIf } from '@angular/common';
import { Component } from '@angular/core';

@Component({
    standalone: true,
    imports: [MarkdownComponent, AsyncPipe, NgIf],
    template: `
    <ng-container *ngIf="post$ | async as post">
      <h1>{{ post.attributes.title }}</h1>
      <analog-markdown [content]="post.content"></analog-markdown>
    </ng-container>
  `,
})
export default class ProjectComponent {
    readonly post$ = injectContent<any>({
        param: 'slug',
        subdirectory: 'projects',
    });
}