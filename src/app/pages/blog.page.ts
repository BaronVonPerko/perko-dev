import {Component} from '@angular/core';
import {injectContentFiles} from '@analogjs/content';
import {CommonModule} from '@angular/common';
import {BlogSlugPipe} from '../pipes/blog-slug.pipe';
import {InjectContentFilesFilterFunction} from '@analogjs/content/lib/inject-content-files';
import {PostAttributes} from '../models';
import {of, take} from 'rxjs';
import {sortPostsByDate} from '../operators';
import {PostPreviewComponent} from '../ui/post-preview.component';
import {PageHeaderComponent} from '../ui/page-header.component';

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
    private readonly contentFilterFn: InjectContentFilesFilterFunction<PostAttributes> =
        (contentFile) => !!contentFile.filename.includes('/src/content/posts/');
    readonly blogs = injectContentFiles(this.contentFilterFn);
    blogs$ = of(this.blogs).pipe(
        sortPostsByDate(),
    );
}
