import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'truncateHead'
})
export class TruncateHeadPipe implements PipeTransform {

  transform(value: string, args?: any): string {
    let start = 6;
    if (args) {
      start = args.length > 0 ? parseInt(args[0], 10) : 6;
    }
    return value.length > start ? value.substring(start) : value;
  }

}
