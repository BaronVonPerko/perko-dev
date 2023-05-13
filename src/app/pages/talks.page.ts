import {Component, inject} from '@angular/core';
import {PageHeaderComponent} from '../ui/page-header.component';
import {of} from 'rxjs';
import {ContentService} from '../services/content.service';
import {AsyncPipe, NgForOf} from '@angular/common';
import {PostPreviewComponent} from '../ui/post-preview.component';

@Component({
    standalone: true,
    imports: [PageHeaderComponent, AsyncPipe, NgForOf, PostPreviewComponent],
    template: `
        <app-page-header>Talks</app-page-header>
        <app-post-preview *ngFor="let talk of talks$ | async" [post]="talk"/>
    `,
    styles: [
        ``
    ]
})
export default class TalksComponent {
    private content = inject(ContentService);
    talks$ = of(this.content.talks);
}
