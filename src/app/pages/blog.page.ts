import {Component} from '@angular/core';
import {PageHeaderComponent} from '../ui/page-header.component';
import {RecentPostsComponent} from '../ui/recent-posts.component';

@Component({
    standalone: true,
    imports: [
        PageHeaderComponent,
        RecentPostsComponent,
    ],
    template: `
        <app-page-header>Blog</app-page-header>
        <app-recent-posts />
    `,
})
export default class BlogListComponent {
}
