import {Component} from '@angular/core';
import {RouterLink, RouterOutlet} from '@angular/router';
import {NgFor} from '@angular/common';
import {injectContentFiles, InjectContentFilesFilterFunction} from '@analogjs/content/lib/inject-content-files';

export interface PostAttributes {
    title: string;
    slug: string;
    description: string;
    coverImage: string;
}

@Component({
    standalone: true,
    imports: [RouterOutlet, RouterLink, NgFor],
    template: `
        <h1>Blog</h1>
        <router-outlet></router-outlet>
<!--    <ul *ngFor="let post of posts">-->
<!--      <li>-->
<!--        <a [routerLink]="['/blog', 'posts', post.slug]">-->
<!--          {{ post.attributes.title }}</a-->
<!--        >-->
<!--      </li>-->
<!--    </ul>-->
  `,
})
export default class BlogComponent {
    // private readonly contentFilterFn: InjectContentFilesFilterFunction<PostAttributes> =
    //     (contentFile) => !!contentFile.filename.includes('/src/content/blog/');
    // readonly posts = injectContentFiles<PostAttributes>(this.contentFilterFn);
    // readonly posts = injectContentFiles<PostAttributes>();
}