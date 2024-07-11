import { Component, inject } from "@angular/core";
import { of } from "rxjs";
import { ContentService } from "../services/content.service";
import { AsyncPipe, DatePipe, NgForOf } from "@angular/common";
import { PreviewCardComponent } from "../ui/preview-card.component";
import { ImagePipe } from "../pipes/image.pipe";
import { TalkSubtitlePipe } from "../pipes/talk-subtitle.pipe";
import { sortTalksByDate } from "../operators";
import { TalkSlugPipe } from "../pipes/talk-slug.pipe";

@Component({
    standalone: true,
    imports: [AsyncPipe, NgForOf, PreviewCardComponent, DatePipe, ImagePipe, TalkSubtitlePipe, TalkSlugPipe],
    template: `
        <section class="talks">
            @for (talk of talks$ | async; track talk.attributes.title) {
                <app-preview-card [title]="talk.attributes.title"
                                  [subtitle]="talk | talkSubtitle"
                                  [imageUrl]="talk.attributes.image | image"
                                  [avatarUrl]="talk.attributes.avatar | image"
                                  [linkUrl]="talk.slug | talkSlug">
                    {{ talk.attributes.abstract }}
                </app-preview-card>
            }
        </section>
    `,
    styles: `
        section.talks {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(400px, 1fr));
            grid-gap: 8px;
        }
    `
})
export default class TalksComponent {
    private content = inject(ContentService);
    talks$ = of(this.content.talks).pipe(
        sortTalksByDate(),
    );
}
