import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'projectSlug',
})
export class ProjectSlugPipe implements PipeTransform {

  transform(value: string) {
    return `/projects/${value}`;
  }

}
