import {Component, inject} from '@angular/core';
import {CommonModule} from '@angular/common';
import {BlogSlugPipe} from '../pipes/blog-slug.pipe';
import {of} from 'rxjs';
import {sortPostsByDate} from '../operators';
import {PostPreviewComponent} from '../ui/post-preview.component';
import {PageHeaderComponent} from '../ui/page-header.component';
import {ContentService} from '../services/content.service';

@Component({
    standalone: true,
    imports: [
        CommonModule,
        BlogSlugPipe,
        PostPreviewComponent,
        PageHeaderComponent,
    ],
    template: `<app-page-header>Blog</app-page-header>
    <app-post-preview *ngFor="let blog of blogs$ | async" [post]="blog"/>
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
