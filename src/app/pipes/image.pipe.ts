import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'image',
})
export class ImagePipe implements PipeTransform {

  transform(value: string,): string {
    return `/images/${value}`;
  }

}
