import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'workshopSlug',
  standalone: true
})
export class WorkshopSlugPipe implements PipeTransform {

  transform(value: string) {
    return `/workshops/${value}`;
  }

}
