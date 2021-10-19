import { PatientsApiService } from './services/patients-api.service';
import { Patient } from './model/patient';
import { Component, OnInit, NgModule } from '@angular/core';
import { Sort } from '@angular/material/sort';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { ReactiveFormsModule } from '@angular/forms';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit{
  title = 'playground-test-app';
  sortedData: Patient[] = [];
  searchData: any;
  reqTime: number = 0;
  constructor(private service: PatientsApiService){}

  ngOnInit() {
    let startFrom = new Date().getTime();
    this.service.getData().then((data: any) => {
      this.sortedData = this.service.getPatients(data);
      this.reqTime = (new Date().getTime() - startFrom) / 1000;
      console.log("Request time in estimated " +this.reqTime+"second");
    });
  }

  sortData(sort: Sort) {
    const data = this.sortedData.slice();
    if (!sort.active || sort.direction === '') {
      this.sortedData = data;
      return;
    }

    this.sortedData = data.sort((a, b) => {
      const isAsc = sort.direction === 'asc';
      switch (sort.active) {
        case 'firstName': return compare(a.firstName, b.firstName, isAsc);
        case 'lastName': return compare(a.lastName, b.lastName, isAsc);
        case 'birthdate': return compare(a.birthdate, b.birthdate, isAsc);
        default: return 0;
      }
    });
  }

  async search(fnameSearch:string, lnameSearch:string){
    this.reset();
    if (fnameSearch === ""  && lnameSearch === "") {
      console.log("Please input any name");
      return;
    }
    this.searchData = await this.service.getSearch(fnameSearch, lnameSearch);
  }

  reset(){
    this.searchData = null;
  }

  keyPressAlphabetic(event: any) {

    var inp = String.fromCharCode(event.keyCode);

    if (/[a-zA-Z]/.test(inp)) {
      return true;
    } else {
      event.preventDefault();
      return false;
    }
  }

}

function compare(a: number | string, b: number | string, isAsc: boolean) {
  return (a < b ? -1 : 1) * (isAsc ? 1 : -1);
}