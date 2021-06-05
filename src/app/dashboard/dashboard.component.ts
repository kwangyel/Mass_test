import { Component, OnInit } from '@angular/core';
import { ActivatedRoute,Router } from '@angular/router';
import { DataService } from '../Services/data.service';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent implements OnInit {

  buildingId:number;
  units = [];

  constructor(
    private router: Router,
    private dataService: DataService,
    private route: ActivatedRoute
  ) { }

  ngOnInit() {
    this.buildingId = this.route.snapshot.params['id'];
    sessionStorage.setItem('buildingId',this.buildingId.toString());
    this.getUnits(this.buildingId);
  }

  showUnitDetails(hhid){
    this.router.navigate(['unit-details',hhid]);
  }

  getUnits(bid){
    this.dataService.getHouseholds(bid).subscribe(response=>{
      if(response['success']=="true"){
        this.units=response['data'];
      }else if(response['success']=="false"){
        console.log("no units for this building")
      }else{
        console.log("error units")
      }
    }) 
  } 

}
