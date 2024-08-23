import {Component, inject, Input, OnInit} from '@angular/core';
import {AsyncPipe, DatePipe, NgForOf, NgIf} from '@angular/common';
import {ContentService} from '../services/content.service';
import {Observable, of} from 'rxjs';
import {sortPostsByDate, takeArray} from '../operators';
import {PreviewCardComponent} from './preview-card.component';
import {ImagePipe} from '../pipes/image.pipe';
import {BlogSlugPipe} from '../pipes/blog-slug.pipe';

@Component({
  selector: 'app-recent-posts',
  standalone: true,
  imports: [NgForOf, NgIf, AsyncPipe, PreviewCardComponent, DatePipe, ImagePipe, BlogSlugPipe],
  template: `
    @for (post of posts$ | async; track post.attributes.title) {
        <app-preview-card [title]="post.attributes.title"
                          [imageUrl]="post.attributes.image | image"
                          [avatarUrl]="post.attributes.avatar ?? '2023_headshot.jpg' | image"
                          [subtitle]="post.attributes.date | date"
                          [linkUrl]="post.slug | blogSlug" />
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
    this.posts$ = of(this.content.blogs).pipe(
        sortPostsByDate(),
        takeArray(this.count),
    );
  }
}
