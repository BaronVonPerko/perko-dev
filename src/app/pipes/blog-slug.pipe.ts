import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'blogSlug',
  standalone: true
})
export class BlogSlugPipe implements PipeTransform {
  transform(value: string): string {
    return `/blog/post/${value}`;
  }
}
