import { injectContent, MarkdownComponent } from "@analogjs/content";
import { PostAttributes } from "../models";
import { AsyncPipe, DatePipe, JsonPipe, NgOptimizedImage } from "@angular/common";
import {
  MatCard,
  MatCardAvatar,
  MatCardHeader,
  MatCardImage,
  MatCardSubtitle,
  MatCardTitle
} from "@angular/material/card";
import { Component, inject } from "@angular/core";
import { RouteMeta } from "@analogjs/router";

export const routeMeta: RouteMeta = {
  meta: (route) => {
    // Analog injects the resolved Markdown content attributes into the route data object
    const postAttributes = route.data['content']?.attributes as PostAttributes;

    const title = postAttributes?.title || 'Perko Dev Blog';
    const ogImage = postAttributes?.image || '/images/angular-logo.png';
    const url = `https://perko.dev/blog/${route.params?.['slug']}`;

    return [
      // Open Graph Tags
      { property: 'og:title', content: title },
      { property: 'og:type', content: 'article' },
      { property: 'og:url', content: url },
      { property: 'og:image', content: ogImage },
      // Twitter Card
      { name: 'twitter:card', content: 'summary_large_image' },
      { name: 'twitter:title', content: title },
      { name: 'twitter:image', content: ogImage },
    ];
  },
};

@Component({
  selector: 'app-blog-post-page',
  imports: [AsyncPipe, MarkdownComponent, MatCard, MatCardHeader, MatCardTitle, MatCardSubtitle, MatCardImage, MatCardAvatar, DatePipe, NgOptimizedImage, JsonPipe],
  template: `
    @if (post$ | async; as post) {
      <mat-card>
        <mat-card-header>
          <mat-card-title>{{ post.attributes.title }}</mat-card-title>
          <mat-card-subtitle>{{ post.attributes.date | date }}</mat-card-subtitle>
          <img mat-card-avatar [ngSrc]="'images/' + post.attributes.avatar" width="20" height="20" alt="Avatar"/>
        </mat-card-header>
        <img mat-card-image [src]="'images/' + post.attributes.image" alt="Card Image"/>
      </mat-card>

      <article>
        <analog-markdown [content]="post.content"></analog-markdown>
      </article>
    }
  `,
  styles: `
    :host {
      display: block;
      max-width: var(--perko-post-width);
      margin: 0 auto;
    }
  `
})
export default class BlogPostPageComponent {
  post$ = injectContent<PostAttributes>({
    param: 'slug',
    subdirectory: 'posts'
  });
}
