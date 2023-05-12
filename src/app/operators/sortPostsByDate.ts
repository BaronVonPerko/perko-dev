import {map} from 'rxjs';
import {PostAttributes} from '../models';
import {ContentFile} from '@analogjs/content';

export function sortPostsByDate() {
    return map((blogs: ContentFile<PostAttributes>[]) => blogs.sort((a, b) => {
        const aDate = new Date(a.attributes.date);
        const bDate = new Date(b.attributes.date);
        return bDate.getTime() - aDate.getTime();
    }));
}