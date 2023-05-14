import {Component, inject} from '@angular/core';
import {CommonModule} from '@angular/common';
import {BlogSlugPipe} from '../pipes/blog-slug.pipe';
import {of} from 'rxjs';
import {sortPostsByDate} from '../operators';
import {PageHeaderComponent} from '../ui/page-header.component';
import {ContentService} from '../services/content.service';
import {PreviewCardComponent} from '../ui/preview-card.component';
import {ImagePipe} from '../pipes/image.pipe';

@Component({
    standalone: true,
    imports: [
        CommonModule,
        BlogSlugPipe,
        PageHeaderComponent,
        PreviewCardComponent,
        ImagePipe,
    ],
    template: `<app-page-header>Blog</app-page-header>
    <app-preview-card *ngFor="let blog of blogs$ | async" 
        [title]="blog.attributes.title"
        [imageUrl]="blog.attributes.image | image"
        [subtitle]="blog.attributes.date | date"
        [linkUrl]="blog.slug | blogSlug" />
    `,
    styles: [
        `
            h1 {
                margin-bottom: 80px;
            }
            
            app-post-preview {
                margin-bottom: 80px;
            }
        `
    ]
})
export default class BlogListComponent {
    private content = inject(ContentService);

    blogs$ = of(this.content.blogs).pipe(
        sortPostsByDate(),
    );
}
