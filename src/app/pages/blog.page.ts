import {Component} from '@angular/core';
import {injectContentFiles} from '@analogjs/content';
import {CommonModule} from '@angular/common';
import {BlogSlugPipe} from '../pipes/blog-slug.pipe';
import {InjectContentFilesFilterFunction} from '@analogjs/content/lib/inject-content-files';
import {PostAttributes} from '../models';
import {of, take} from 'rxjs';
import {sortPostsByDate} from '../operators';

@Component({
    standalone: true,
    imports: [
        CommonModule,
        BlogSlugPipe,
    ],
    template: `<h1>Blog</h1>
    <p *ngFor="let blog of blogs$ | async">
        <a href="{{blog.slug | blogSlug}}">{{blog.attributes.title }}</a>
    </p>
    `
})
export default class BlogListComponent {
    private readonly contentFilterFn: InjectContentFilesFilterFunction<PostAttributes> =
        (contentFile) => !!contentFile.filename.includes('/src/content/posts/');
    readonly blogs = injectContentFiles(this.contentFilterFn);
    blogs$ = of(this.blogs).pipe(
        sortPostsByDate(),
    );
}
