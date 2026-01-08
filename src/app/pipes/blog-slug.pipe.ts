import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'blogSlug',
})
export class BlogSlugPipe implements PipeTransform {
  transform(value: string): string {
    return `/blog/post/${value}`;
  }
}
