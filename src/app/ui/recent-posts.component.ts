import {ContentFile, injectContent} from '@analogjs/content';
import {PostAttributes} from '../models';
import {Component, inject, Input, OnInit} from '@angular/core';
import {AsyncPipe, DatePipe} from '@angular/common';
import {map, Observable, of, tap} from 'rxjs';
import {sortPostsByDate, takeArray} from '../operators';
import {PreviewCardComponent} from './preview-card.component';
import {ImagePipe} from '../pipes/image.pipe';
import {BlogSlugPipe} from '../pipes/blog-slug.pipe';
import {ContentService} from "../services/content.service";

@Component({
  selector: 'app-recent-posts',
  imports: [AsyncPipe, PreviewCardComponent, DatePipe, ImagePipe, BlogSlugPipe],
  template: `
    @for (post of posts$ | async; track post.attributes['title']) {
      <app-preview-card [title]="post.attributes['title']"
                        [imageUrl]="post.attributes['image'] | image"
                        [avatarUrl]="post.attributes['avatar'] ?? '2023_headshot.jpg' | image"
                        [subtitle]="post.attributes['date'] | date"
                        [linkUrl]="post.slug | blogSlug"/>
    }
  `,
  styles: `
    :host {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
      grid-gap: 0.5rem;
    }
  `
})
export class RecentPostsComponent implements OnInit {
  @Input() count = 0;
  content = inject(ContentService);
  posts$: Observable<any> | undefined;

  ngOnInit() {
    this.posts$ = of(this.content.blogs as ContentFile<PostAttributes>[]).pipe(
      map(posts => posts.map(post => ({
        ...post,
        slug: post.filename.split('/').pop()?.replace('.md', '') || ''
      }))),
      sortPostsByDate(),
      takeArray(this.count),
    );
  }
}
