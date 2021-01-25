import { HttpClient } from '@angular/common/http';
import { AfterViewInit, Component, OnInit } from '@angular/core';
import { environment } from 'src/environments/environment';
import * as Chart from 'chart.js';
import { Router } from '@angular/router';

@Component({
  selector: 'app-summary-dash',
  templateUrl: './summary-dash.component.html',
  styleUrls: ['./summary-dash.component.scss']
})
export class SummaryDashComponent implements OnInit,AfterViewInit {
  API_URL = environment.API_URL;

  northMegaZone = [
    {"id": 6, "name": "Kabisa"},
    {"id": 22, "name": "Begana"},
    {"id": 38, "name": "Lower Samteling"},
    {"id": 39, "name": "Upper Samteling"},
    {"id": 40, "name": "Langjophakha"},
    {"id": 42, "name": "Upper Taba"},
    {"id": 43, "name": "Lower Taba"},
    {"id": 45, "name": "Pamtsho"},
    {"id": 46, "name": "Changtagang"},
    {"id": 47, "name": "Lower Dechencholing"},
    {"id": 48, "name": "Upper Dechencholing"},
    {"id": 57, "name": "Hejo Village"},
    {"id": 61, "name": "Jungzhina"},
    {"id": 59, "name": "India House"},
    {"id": 52, "name": "Dechencholing RBG"},
  ]

  c1MegaZone = [
    {"id": 34, "name": "Zilukha"},
    {"id": 35, "name": "Kawajangsa"},
    {"id": 31, "name": "Upper Motithang"},
    {"id": 32, "name": "Lower Motithang"},
    {"id": 27, "name": "Changangkha"},
    {"id": 33, "name": "Chang Zeri"},
    {"id": 41, "name": "Chang Khorlo"},
    {"id": 29, "name": "Norzin Tag"},
    {"id": 28, "name": "Norzin Wog"},
    {"id": 55, "name": "Yangchenphu Area"},
    {"id": 37, "name": "Dzong Precinct"},
    {"id": 26, "name": "Lhengye Densa"},
    {"id": 58, "name": "Imtrat Area"},
    {"id": 50, "name": "RBP HQ"}
  ]

  c2MegaZone = [
    {"id": 30, "name": "Changidaphu"},
    {"id": 4, "name": "Upper Changzamtok"},
    {"id": 51, "name": "Lower Changzamtok"},
    {"id": 25, "name": "Changbangdu"},
    {"id": 36, "name": "Changjiji"},
    {"id": 24, "name": "Changjalu"},
    {"id": 17, "name": "Chang Olakha"},
    {"id": 20, "name": "Lubding"},
    {"id": 21, "name": "RIM(Tsa Tso)"},
    {"id": 53, "name": "Samazingkha RBA"},
    {"id": 18, "name": "Lungtenphu RBA"},
    {"id": 19, "name": "Pelkhil Area"},
    {"id": 60, "name": "JDWNRH"}
  ]
  southMegaZone =[
    {"id": 5, "name": "Olarangchu Workshop Area"},
    {"id": 3, "name": "Tshalumarphey"},
    {"id": 2, "name": "TshaluBarp"},
    {"id": 14, "name": "Simtokha Dzong Area"},
    {"id": 16, "name": "Simtokha E4"},
    {"id": 13, "name": "Above Old Highway"},
    {"id": 11, "name": "Babesa Lam Wog"},
    {"id": 10, "name": "Babesa Lam Tag"},
    {"id": 9, "name": "Serbithang"},
    {"id": 7, "name": "RTC Area"},
    {"id": 56, "name": "Gangchey and Nyezergang"},
    {"id": 49, "name": "Debsi"},
    {"id": 8, "name": "Dantak 1"},
    {"id": 15, "name": "Dantak 2"},

  ];

  //North megaZOne
  northData=[];
  c1Data = [];
  c2Data = [];
  southData = [];

  northMegazoneCanvas: any;
  northMegazoneCtx: any;

  constructor(
    private http: HttpClient,
    private router: Router
  ) { }

  ngOnInit() {
    this.fetchData()
  }

  
  ngAfterViewInit() {


  }

  back(){
    this.router.navigate(['/select'])
  }
  fetchData(){
    this.northMegaZone.forEach(item =>{

      this.http.get(`${this.API_URL}/get-str/${item.id}`).subscribe((data: any) => {
        let totalCompleted = 0;
        let totalStructures = data.length;
        data.forEach(element => {
            if(element.properties.status === "COMPLETE"){
              totalCompleted += 1;
            }       
        });
        let totalProgress = totalStructures- totalCompleted;
        let percentageCompleted = (totalCompleted/totalStructures *100).toFixed(2)
        this.northData.push({"name":item.name, "totalStructures": totalStructures, "totalCompleted": totalCompleted, "totalProgress":totalProgress, "percentageCompleted": percentageCompleted})
      })
    })

    this.c1MegaZone.forEach(item =>{
      this.http.get(`${this.API_URL}/get-str/${item.id}`).subscribe((data: any) => {
        let totalCompleted = 0;
        let totalStructures = data.length;
        data.forEach(element => {
            if(element.properties.status === "COMPLETE"){
              totalCompleted += 1;
            }       
        });
        let totalProgress = totalStructures- totalCompleted;
        let percentageCompleted = (totalCompleted/totalStructures *100).toFixed(2)
        
        this.c1Data.push({"name":item.name, "totalStructures": totalStructures, "totalCompleted": totalCompleted, "totalProgress":totalProgress, "percentageCompleted": percentageCompleted})
      })
    })

    this.c2MegaZone.forEach(item =>{
      this.http.get(`${this.API_URL}/get-str/${item.id}`).subscribe((data: any) => {
        let totalCompleted = 0;
        let totalStructures = data.length;
        data.forEach(element => {
            if(element.properties.status === "COMPLETE"){
              totalCompleted += 1;
            }       
        });
        let totalProgress = totalStructures- totalCompleted;
        let percentageCompleted = (totalCompleted/totalStructures *100).toFixed(2)
        
        this.c2Data.push({"name":item.name, "totalStructures": totalStructures, "totalCompleted": totalCompleted, "totalProgress":totalProgress, "percentageCompleted": percentageCompleted})
      })
    })

    this.southMegaZone.forEach(item =>{
      this.http.get(`${this.API_URL}/get-str/${item.id}`).subscribe((data: any) => {
        let totalCompleted = 0;
        let totalStructures = data.length;
        data.forEach(element => {
            if(element.properties.status === "COMPLETE"){
              totalCompleted += 1;
            }       
        });
        let totalProgress = totalStructures- totalCompleted;
        let percentageCompleted = (totalCompleted/totalStructures *100).toFixed(2)
        
        this.southData.push({"name":item.name, "totalStructures": totalStructures, "totalCompleted": totalCompleted, "totalProgress":totalProgress, "percentageCompleted": percentageCompleted})
      })
    })
  }



}
