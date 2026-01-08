import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'talkSlug',
})
export class TalkSlugPipe implements PipeTransform {

  transform(value: string) {
    return `/talks/${value}`;
  }

}
