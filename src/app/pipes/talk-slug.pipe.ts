import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'talkSlug',
  standalone: true
})
export class TalkSlugPipe implements PipeTransform {

  transform(value: string) {
    return `/talks/${value}`;
  }

}
