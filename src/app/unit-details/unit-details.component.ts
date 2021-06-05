import { Component, OnInit } from '@angular/core';
import { ActivatedRoute,Router } from '@angular/router';
import { DataService } from '../Services/data.service';

@Component({
  selector: 'app-unit-details',
  templateUrl: './unit-details.component.html',
  styleUrls: ['./unit-details.component.scss']
})
export class UnitDetailsComponent implements OnInit {

  hhid:number;
  member:[];
  displayedColumns: string[] = ['cid', 'age', 'gender','contact','occupation','workplace','workzone','covid_test_status','vaccine_status','most_active'];

  constructor(
    private router: Router,
    private dataService: DataService,
    private route: ActivatedRoute
  ) { }

  ngOnInit() {
    this.hhid= this.route.snapshot.params['id'];
    this.getMember(this.hhid);
  }
  getMember(hhid){
    this.dataService.getFamilyMembers(hhid).subscribe(response=>{
      if(response.success === "true"){
        this.member = response.data
      }
    })
  }

}
