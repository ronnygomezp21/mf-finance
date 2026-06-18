import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  standalone: false,
  name: 'customDateFormat',
})
export class CustomDateFormatPipe implements PipeTransform {
  transform(value?: string): string {
    const monthsMap: Record<string, string> = {
      enero: '01',
      febrero: '02',
      marzo: '03',
      abril: '04',
      mayo: '05',
      junio: '06',
      julio: '07',
      agosto: '08',
      septiembre: '09',
      octubre: '10',
      noviembre: '11',
      diciembre: '12',
    };
    if (!value) return '';
    const parts = value.split(' ');
    const day = parts[1];
    const month = monthsMap[parts[3]];
    const year = parts[5].substring(0, 4);

    return `${year}/${month}/${day}`;
  }
}
