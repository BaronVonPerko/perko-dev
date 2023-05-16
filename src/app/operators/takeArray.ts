import {map} from 'rxjs';

export function takeArray(count: number) {
    if (count > 0) {
        return map((array: any[]) => array.slice(0, count));
    }
    return map(array => array);
}