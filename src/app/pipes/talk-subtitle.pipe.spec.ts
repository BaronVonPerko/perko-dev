import {TalkSubtitlePipe} from './talk-subtitle.pipe';
import {TalkAttributes} from '../models';
import {ContentFile} from '@analogjs/content';

describe('TalkSubtitlePipe', () => {
    it('create an instance', () => {
        const pipe = new TalkSubtitlePipe();
        expect(pipe).toBeTruthy();
    });

    it('will not display \'undefined\' if the location is not defined', () => {
        const pipe = new TalkSubtitlePipe();
        const file: ContentFile<TalkAttributes> = {
            filename: 'filename',
            slug: 'slug',
            attributes: {
                date: '2020-05-01',
                conference: 'Conference',
                image: 'image',
                abstract: 'abstract',
                title: 'title',
            }
        };
        expect(pipe.transform(file)).toEqual('May 1, 2020 | Conference');
    });
});
