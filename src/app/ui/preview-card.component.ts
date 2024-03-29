import {Component, Input} from '@angular/core';
import {CommonModule} from '@angular/common';
import {BlogSlugPipe} from '../pipes/blog-slug.pipe';
import {ControlButtonsComponent} from './control-buttons.component';
import {ImagePipe} from '../pipes/image.pipe';

@Component({
    selector: 'app-preview-card',
    standalone: true,
    imports: [CommonModule, BlogSlugPipe, ControlButtonsComponent, ImagePipe],
    template: `
        <div class="wrapper"
             style="background-image: url({{imageUrl}});">
            <div class="overlay"></div>
            <div class="content">
                <app-control-buttons/>
                
                @if (date) {
                    <p>{{date | date }}</p>
                }
                
                @if (linkUrl) {
                    <h3>
                        <a href="{{linkUrl}}">{{title}}</a>
                    </h3>
                } @else {
                    <h3>{{title}}</h3>
                }

                @if (subtitle) {
                    <h4>{{subtitle}}</h4>
                }
                <p>
                    <ng-content></ng-content>
                </p>
            </div>
        </div>
    `,
    styles: [`
        :host {
            display: block;
            max-width: var(--max-page-width);
            margin: 60px auto 0;
        }

        .wrapper {
            padding: 0 20px 160px;
            max-width: 600px;
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
        
        h3 {
            margin-bottom: 10px;
        }
        
        h4 {
            margin-bottom: 40px;
        }
    `
    ]
})
export class PreviewCardComponent {
    @Input() linkUrl: string | undefined;
    @Input({required: true}) imageUrl: string | undefined;
    @Input({required: true}) title: string | undefined;
    @Input() subtitle: string | undefined | null;
    @Input() date: string | undefined;
}
