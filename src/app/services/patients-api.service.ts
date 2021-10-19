import { Patient } from './../model/patient';
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class PatientsApiService {
  private  apiUrl = 'https://try.smilecdr.com/baseR4/Patient?_format=json';

  constructor(private http: HttpClient) {}

  getData(){
    return new Promise(resolve =>{
      this.http.get<any>(this.apiUrl).subscribe(data =>{
        data = data["entry"];
        resolve(data);
      },
        err =>{
          console.log(err);
      });
    });
  }

  getPatients(data: any){
    let patients: Patient[] = [];
    for (let i = 0; i < data.length; i++) {
      let fname ="";
      let lname =""; 
      let bdate ="";
      let gen ="";
      let addr = '';
      let phonenum = '';
      if(data[i].resource.name != undefined){
        if (data[i].resource.name[0].given.length > 1) {
          for (let j = 0; j < data[i].resource.name[0].given.length; j++) {
            fname += data[i].resource.name[0].given[j] +" ";        
          }
          fname = fname.trim();
        }else{
          fname = data[i].resource.name[0].given;
        }
        lname = data[i].resource.name[0].family;
        bdate = data[i].resource.birthDate;
        gen = data[i].resource.gender;
        
        patients.push({
          firstName: fname,
          lastName: lname,
          birthdate: bdate,
          address: addr,
          gender: gen,
          phone: phonenum
        })
      }
    }
    return patients;
  }

  getSearch(fnameSearch: string, lnameSearch: string){
    let searchUrl = 'https://try.smilecdr.com/baseR4/Patient?';
    let searchPatients: Patient[] = []
    if (fnameSearch === ""&& lnameSearch !== ""){
      searchUrl = searchUrl + "family=" + lnameSearch;
    }else if(fnameSearch !== "" && lnameSearch === ""){
      searchUrl = searchUrl + "given=" + fnameSearch;
    }else{
      searchUrl = searchUrl + "given=" + fnameSearch + "&" + "family=" + lnameSearch;
    }

    return new Promise(resolve =>{
      this.http.get<any>(searchUrl).subscribe(data =>{
        data = data["entry"];
        data = this.getPatients(data);
        resolve(data);
      },
        err =>{
          console.log(err);
      });
    });
  }
}
