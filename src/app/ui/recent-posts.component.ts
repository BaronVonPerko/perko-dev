import {Component, inject, Input, OnInit} from '@angular/core';
import {AsyncPipe, DatePipe, NgForOf, NgIf} from '@angular/common';
import {ContentService} from '../services/content.service';
import {Observable, of} from 'rxjs';
import {sortPostsByDate, takeArray} from '../operators';
import {PreviewCardComponent} from './preview-card.component';
import {ImagePipe} from '../pipes/image.pipe';
import {PillComponent} from './pill.component';
import {BlogSlugPipe} from '../pipes/blog-slug.pipe';

@Component({
  selector: 'app-recent-posts',
  standalone: true,
  imports: [NgForOf, NgIf, AsyncPipe, PreviewCardComponent, DatePipe, ImagePipe, PillComponent, BlogSlugPipe],
  template: `
    @for (post of posts$ | async; track post.attributes.title) {
        <app-preview-card [title]="post.attributes.title"
                          [imageUrl]="post.attributes.image | image"
                          [subtitle]="post.attributes.date | date"
                          [linkUrl]="post.slug | blogSlug">
            @if (post.attributes.tags) {
                @for (tag of post.attributes.tags.split(','); track tag) {
                <app-pill>{{tag}}</app-pill>
                }
            }
        </app-preview-card>
    }
  `,
  styles: [
  ]
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
