import { injectContent, MarkdownComponent, injectContentFiles } from "@analogjs/content";
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
import { Component } from "@angular/core";
import { ActivatedRouteSnapshot, ResolveFn } from "@angular/router";
import { MetaTag, RouteMeta } from "@analogjs/router";

function injectActivePostAttributes(
  route: ActivatedRouteSnapshot,
): PostAttributes {
  const file = injectContentFiles<PostAttributes>().find((contentFile) => {
    return (
      contentFile.filename === `/src/content/${route.params['slug']}.md` ||
      contentFile.slug === route.params['slug']
    );
  });

  return file!.attributes;
}

export const postMetaResolver: ResolveFn<MetaTag[]> = (route) => {
  const postAttributes = injectActivePostAttributes(route);
  return [
    {
      name: 'author',
      content: 'Chris Perko',
    },
    {
      property: 'og:title',
      content: postAttributes.title,
    },
    {
      property: 'og:image',
      content: `https://perko.dev/images/${postAttributes.image}`,
    },
  ];
}

export const routeMeta: RouteMeta = {
  meta: postMetaResolver,
}

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
