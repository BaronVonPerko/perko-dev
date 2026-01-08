import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'workshopSlug',
})
export class WorkshopSlugPipe implements PipeTransform {

  transform(value: string) {
    return `/workshops/${value}`;
  }

}
