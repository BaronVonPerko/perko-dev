import {map} from 'rxjs';
import {ContentFile} from '@analogjs/content';
import {TalkAttributes} from '../models';

export function sortTalksByDate() {
    return map((blogs: ContentFile<TalkAttributes>[]) => blogs.sort((a, b) => {
        const aDate = new Date(a.attributes.date);
        const bDate = new Date(b.attributes.date);
        return bDate.getTime() - aDate.getTime();
    }));
}