import {Component, Input} from '@angular/core';
import { CommonModule } from '@angular/common';
import {ContentFile} from '@analogjs/content';
import {PostAttributes} from '../models';
import {BlogSlugPipe} from '../pipes/blog-slug.pipe';
import {ControlButtonsComponent} from './control-buttons.component';
import {ImagePipe} from '../pipes/image.pipe';

@Component({
  selector: 'app-post-preview',
  standalone: true,
  imports: [CommonModule, BlogSlugPipe, ControlButtonsComponent, ImagePipe],
  template: `
      <div class="wrapper" *ngIf="post"
           style="background-image: url({{post.attributes.image | image}});">
          <div class="overlay"></div>
          <div class="content">
              <app-control-buttons/>
              <p>{{post.attributes.date | date }}</p>
              <h3>
                  <a href="{{post.slug | blogSlug}}">{{post.attributes.title }}</a>
              </h3>
          </div>
      </div>
  `,
  styles: [`
    :host {
      display: block;
    }

    .wrapper {
      padding: 20px 20px 160px;
      max-width: 600px;
      margin: 0 auto;
      border: 4px solid var(--color-secondary);
      position: relative;
      background-position: center;
      background-size: cover;
    }

    .overlay {
      position: absolute;
      top: 0;
      left: 0;
      bottom: 0;
      right: 0;
      background-color: var(--color-primary-opaque);
      z-index: 10;
    }

    .content {
      position: relative;
      z-index: 20;
      text-shadow: 0 0 4px black;
    }

    img {
      width: 100%;
    }
    
    p {
      margin: 0;
    }
  `]
})
export class PostPreviewComponent {
  @Input() post: ContentFile<PostAttributes> | undefined;
}
