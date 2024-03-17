import { Component, OnInit, QueryList, ViewChildren } from '@angular/core';
import { SortableHeaderDirective, compare } from 'src/app/directives/sortable-header.directive';
import { UtilityService } from 'src/app/services/utility.service';

@Component({
  selector: 'app-records',
  templateUrl: './records.component.html',
  styleUrls: ['./records.component.scss']
})
export class RecordsComponent implements OnInit {

  records: any[] = [];
  tableRecords: any[] = [];
  @ViewChildren(SortableHeaderDirective) headers!: QueryList<SortableHeaderDirective>;
  filter: any;

  constructor(private utilityService: UtilityService) { }

  ngOnInit(): void {
    this.getUserRecords();
  }

  getUserRecords() {
    this.utilityService.getRecords().subscribe((empData: any) => {
      this.records = empData;
      this.tableRecords = empData;
    }, (error) => {
      console.error(error);
    })
  }
  /**
  * Sort table
  * @param param0 
  */
  onSort({ column, direction }: any) {
    // resetting other headers
    this.headers.forEach((header) => {
      if (header.sortable !== column) {
        header.direction = '';
      }
    });

    // sorting countries
    if (direction === '' || column === '') {
      this.tableRecords = this.records;
    } else {
      this.tableRecords = [...this.records].sort((a, b) => {
        const res = compare(a[column], b[column]);
        return direction === 'asc' ? res : -res;
      });
    }
  }
}
