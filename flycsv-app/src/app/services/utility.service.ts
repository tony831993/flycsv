import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { AuthService } from './auth.service';

@Injectable({
  providedIn: 'root'
})
export class UtilityService {

  constructor(private http: HttpClient, private authService: AuthService) {

  }
  /**
   * Save employee data
   * @param data 
   * @returns 
   */
  saveCsvData(data: any) {
    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
      })
    };
    const user: any = this.authService.getLoggedInUser();
    const payload = {
      user_id: user.id,
      data
    };
    return this.http.post(`${environment.employeeUrl}/savedata`, payload, httpOptions);
  }
  /**
   * Get Employee records
   * @returns 
   */
  getRecords() {
    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
      })
    };
    const user: any = this.authService.getLoggedInUser();
    const payload = {
      user_id: user.id,
    };
    return this.http.post(`${environment.employeeUrl}/getdata`, payload, httpOptions);
  }
  /**
   * Upload CSV data
   * @param file 
   * @returns 
   */
  uploadCsv(file:any) {
    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'multipart/form-data',
      })
    };
    const user: any = this.authService.getLoggedInUser();
    const payload = {
      user_id: user.id,
      csv_file: file
    }
    return this.http.post(`${environment.employeeUrl}/csv/upload`, user, httpOptions)
  }
  /**
   * Check file extension
   * @param file 
   * @returns 
   */
  isValidCSVFile(file: any) {
    return file.name.endsWith('.csv');
  }
  /**
   * Get Header Array
   * @param csvRecordsArr 
   * @returns 
   */
  getHeaderArray(csvRecordsArr: any) {
    let headers = (<string>csvRecordsArr[0]).split(',');
    let headerArray = [];
    for (let j = 0; j < headers.length; j++) {
      headerArray.push(headers[j]);
    }
    return headerArray;
  }
  // /**
  //  * Convert CSV to Object
  //  * @param csv 
  //  * @returns 
  //  */
  // csvToObject(csv: any) {
  //   // Split the CSV into rows
  //   const rows = csv.split('\n');
  //   // Extract headers from the first row
  //   const headers = rows[0].split(',');
  //   // Initialize an array to store objects
  //   const objects = [];
  //   // Iterate over rows starting from the second one (index 1)
  //   for (let i = 1; i < rows.length; i++) {
  //     // Split the current row into values
  //     const values = rows[i].split(',');
  //     // Create an object and populate it with values
  //     const obj: any = {};
  //     for (let j = 0; j < headers.length; j++) {
  //       obj[headers[j]] = values[j];
  //     }
  //     // Add the object to the array
  //     objects.push(obj);
  //   }
  //   return objects;
  // }
}
