import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'truncate'
})
export class TruncatePipe implements PipeTransform {
  transform(value: string, args: string) : string {
    let limit = 25;
    let trail = '...';
    if (args) {
      limit = parseInt(args, 10);
    }

    return value.length > limit ? value.substring(0, limit) + trail : value;
  }
}
