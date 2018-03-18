import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'truncate'
})
export class TruncatePipe implements PipeTransform {
  transform(value: string, args: string): string {
    let limit = 25;
    const trail = '...';
    if (args) {
      limit = parseInt(args, 10);
    }
    try {
      return value.length > limit ? value.substring(0, limit) + trail : value;
    } catch (e) {
      return "";
    }
  }
}
