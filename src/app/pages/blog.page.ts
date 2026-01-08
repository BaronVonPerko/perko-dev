import {Component} from "@angular/core";
import {RecentPostsComponent} from "../ui/recent-posts.component";

@Component({
  selector: 'app-blog-page',
  imports: [RecentPostsComponent],
  template: `
    <app-recent-posts />
  `,
  styles: `
    :host {
      --perko-card-subtitle-align: right;
    }
    img {
      width: 60px;
      height: 60px;
      transition: transform 0.2s;

      &:hover {
        transform: rotate(10deg);
      }
    }
  `
})
export default class BlogPageComponent {}
