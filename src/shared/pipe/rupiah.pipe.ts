import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'rupiah',
  standalone: true 
})
export class RupiahPipe implements PipeTransform {
  transform(value: string | undefined): string | undefined {
    if (!value) return undefined;
    return this.convert(value)
  }

  convert(value: string): string {
    let bilangan = value;
	
    let split = bilangan.split(','),
    sisa = split[0].length % 3,
    rupiah = split[0].slice(0, sisa),
    ribuan = split[0].slice(sisa).match(/\d{1,3}/gi);
      
    if (ribuan) {
      const separator = sisa ? '.' : '';
      rupiah += separator + ribuan.join('.');
    }
    rupiah = split[1] != undefined ?  'Rp. ' + rupiah + ',' + split[1] : 'Rp. ' + rupiah + ',00';
    return rupiah
  }
}