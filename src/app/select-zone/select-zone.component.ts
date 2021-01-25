import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { DataService } from '../Services/data.service';



@Component({
  selector: 'app-select-zone',
  templateUrl: './select-zone.component.html',
  styleUrls: ['./select-zone.component.scss']
})
export class SelectZoneComponent implements OnInit {

  subZones = [];
  zoneForm: FormGroup;
  role = ""
  showSum = false

  constructor(
    private router: Router,
    private fb: FormBuilder,
    private dataService: DataService 
  ) { }

  ngOnInit() {
    this.reactiveForm()
    this.getData()
    this.role = localStorage.getItem('role')
    if(this.role === "view"){
      this.showSum = true
    }
  }

  getData(){
    this.dataService.getAllZones().subscribe(res=>{
      this.subZones = res.data
    })
  }

  reactiveForm(){
    this.zoneForm = this.fb.group({
      subZoneControl: ['',Validators.compose([Validators.required])]
    })
  }

  submit(){
    if(this.zoneForm.valid){
      sessionStorage.setItem("zone",this.zoneForm.get('subZoneControl').value)
      this.router.navigate(['map'])
    }
  }

  showSummary(){
    this.router.navigate(['summary'])
  }
}
