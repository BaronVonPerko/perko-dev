import { Pipe, PipeTransform } from '@angular/core';
import {ContentFile} from '@analogjs/content';
import {TalkAttributes} from '../models';
import {DatePipe} from '@angular/common';

@Pipe({
  name: 'talkSubtitle',
  standalone: true
})
export class TalkSubtitlePipe implements PipeTransform {

  transform(value: ContentFile<TalkAttributes>): string {
    const date = new DatePipe('en-US', 'UTC').transform(value.attributes.date);

    let retstr = `${date} | ${value.attributes.conference}`;

    if (value.attributes.location) {
      retstr += ` | ${value.attributes.location}`;
    }

    return retstr;
  }

}
