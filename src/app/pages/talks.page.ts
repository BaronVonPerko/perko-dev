import {Component, inject} from '@angular/core';
import {PageHeaderComponent} from '../ui/page-header.component';
import {of} from 'rxjs';
import {ContentService} from '../services/content.service';
import {AsyncPipe, DatePipe, NgForOf} from '@angular/common';
import {PreviewCardComponent} from '../ui/preview-card.component';
import {ImagePipe} from '../pipes/image.pipe';
import {TalkSubtitlePipe} from '../pipes/talk-subtitle.pipe';
import {sortTalksByDate} from '../operators';

@Component({
    standalone: true,
    imports: [PageHeaderComponent, AsyncPipe, NgForOf, PreviewCardComponent, DatePipe, ImagePipe, TalkSubtitlePipe],
    template: `
        <app-page-header>Talks</app-page-header>
        <app-preview-card *ngFor="let talk of talks$ | async"
                          [title]="talk.attributes.title"
                          [subtitle]="talk | talkSubtitle"
                          [imageUrl]="talk.attributes.image | image"
                          [linkUrl]="talk.slug">
            {{talk.attributes.abstract}}
        </app-preview-card>
    `,
})
export default class TalksComponent {
    private content = inject(ContentService);
    talks$ = of(this.content.talks).pipe(
        sortTalksByDate(),
    );
}
