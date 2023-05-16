import {Component, inject, Input, OnInit} from '@angular/core';
import {AsyncPipe, DatePipe, NgForOf, NgIf} from '@angular/common';
import {ContentService} from '../services/content.service';
import {Observable, of, tap} from 'rxjs';
import {sortPostsByDate, takeArray} from '../operators';
import {PreviewCardComponent} from './preview-card.component';
import {ImagePipe} from '../pipes/image.pipe';
import {ContentFile} from '@analogjs/content';
import {PostAttributes} from '../models';

@Component({
  selector: 'app-recent-posts',
  standalone: true,
  imports: [NgForOf, NgIf, AsyncPipe, PreviewCardComponent, DatePipe, ImagePipe],
  template: `
      <ng-container *ngIf="posts$ | async as posts">
          <app-preview-card *ngFor="let post of posts"
                            [title]="post.attributes.title"
                            [imageUrl]="post.attributes.image | image"
                            [subtitle]="post.attributes.date | date"
                            [linkUrl]="post.slug" />
      </ng-container>
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
