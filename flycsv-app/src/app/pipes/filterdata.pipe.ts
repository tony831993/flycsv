import { Pipe, PipeTransform } from '@angular/core';
import { CsvData } from '../models/CsvData';

@Pipe({
  name: 'filterdata'
})
export class FilterdataPipe implements PipeTransform {

  transform(values: CsvData[], filter: string): CsvData[] {
    if (!filter || filter.length === 0) {
      return values;
    }
    if (values.length === 0) {
      return values;
    }

    return values.filter((value: any) => {
      const employeeIdFound = value.employee_id.toString().indexOf(filter) !== -1;
      const firstnameFound = value.firstname.toLowerCase().indexOf(filter.toLowerCase()) !== -1;
      const lastnameFound = value.lastname.toLowerCase().indexOf(filter.toLowerCase()) !== -1;
      const salaryFound = value.salary.toString().indexOf(parseInt(filter)) !== -1;

      if (employeeIdFound || firstnameFound || lastnameFound || salaryFound) {
        return value;
      }
    });
  }

}
