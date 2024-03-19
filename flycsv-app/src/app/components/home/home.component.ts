import { Component, QueryList, ViewChild, ViewChildren } from '@angular/core';
import { SortEvent, SortableHeaderDirective, compare } from 'src/app/directives/sortable-header.directive';
import { CsvData } from 'src/app/models/CsvData';
import { UtilityService } from 'src/app/services/utility.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent {
  public records: any[] = [];
  filter: any;
  tableRecords: any[] = [];
  @ViewChild('csvReader') csvReader: any;
  @ViewChildren(SortableHeaderDirective)
  headers!: QueryList<SortableHeaderDirective>;
  alert: any = { type: 'warning', message: '' };
  showAlert = false;

  constructor(private utilityService: UtilityService) {

  }
  /**
   * File upload listener
   * @param $event 
   */
  uploadListener($event: any): void {
    let text = [];
    let files = $event.srcElement.files;
    if (this.utilityService.isValidCSVFile(files[0])) {
      let input = $event.target;
      let reader = new FileReader();
      reader.readAsText(input.files[0]);
      reader.onload = () => {
        let csvData = reader.result;
        let csvRecordsArray = (<string>csvData).split(/\r\n|\n/);
        let headersRow = this.utilityService.getHeaderArray(csvRecordsArray);
        this.records = this.getDataRecordsArrayFromCSVFile(
          csvRecordsArray,
          headersRow.length
        );
        this.tableRecords = this.getDataRecordsArrayFromCSVFile(
          csvRecordsArray,
          headersRow.length
        );
      };
      reader.onerror = function () {
        console.log('error is occured while reading file!');
      };
    } else {
      alert('Please import valid .csv file.');
      this.fileReset();
    }
  }
  /**
   * Get data records from array
   * @param csvRecordsArray 
   * @param headerLength 
   * @returns 
   */
  getDataRecordsArrayFromCSVFile(csvRecordsArray: any, headerLength: any) {
    let csvArr = [];
    for (let i = 1; i < csvRecordsArray.length; i++) {
      let curruntRecord = (<string>csvRecordsArray[i]).split(',');
      if (curruntRecord.length == headerLength) {
        let csvRecord: CsvData = new CsvData();
        // let csvRecord: any = {};
        csvRecord.employee_id = curruntRecord[0].trim();
        csvRecord.firstname = curruntRecord[1].trim();
        csvRecord.lastname = curruntRecord[2].trim();
        csvRecord.salary = curruntRecord[3].trim();
        csvArr.push(csvRecord);
      }
    }
    return csvArr;
  }
  /**
   * File reset
   */
  fileReset() {
    this.csvReader.nativeElement.value = '';
    this.records = [];
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

  hideAlert() {
    setTimeout(() => {
      this.showAlert = false;
    }, 3000)
  }
  /**
   * Save csv records
   */
  saveData() {
    this.utilityService.saveCsvData(JSON.stringify(this.records)).subscribe((resp) => {
      this.alert = { type: 'success', message: 'Data saved successfuly.' }
      this.showAlert = true;
      this.hideAlert();
      this.fileReset();
    }, (error) => {
      console.log(error);
    });
  }
}
