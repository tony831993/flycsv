import { Component } from '@angular/core';
import { UtilityService } from 'src/app/services/utility.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent {

  constructor(private utilityService: UtilityService) {

  }

  handleFileSelect(evt: any) {
    var files = evt.target.files; // FileList object
    var file = files[0];
    // console.log(file);
    if (file) {
      this.utilityService.uploadCsv(file).subscribe((resp) => {
        
      }, (error) => {
        console.error(error);
      })
      // var reader = new FileReader();
      // reader.readAsText(file);
      // reader.onload = (event: any) => {
      //   var csv = event.target.result; // Content of CSV file
      //   const csvObj = this.csvToObject(csv);
      // }
    }
  }

  

}
