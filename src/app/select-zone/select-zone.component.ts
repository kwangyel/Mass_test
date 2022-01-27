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
  zones = [];
  dzongkhags = [];
  dzongkhag:string;
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
    // this.getData()
    this.role = sessionStorage.getItem('role')
    if(this.role === "VIEW"){
      this.showSum = true
    }
    this.dataService.getAllDzo().subscribe(res=>{
      this.dzongkhags = res.data
      console.log(res)
    })
  }
  getSubzones(zid){
    console.log(zid)
    this.dataService.getSubZones(zid).subscribe(res=>{
      this.subZones= res.data
    })
  }

  getZones(dzoId){
    this.dataService.getZones(dzoId).subscribe(res=>{
      this.zones = res.data
    })
  }

  reactiveForm(){
    this.zoneForm = this.fb.group({
      subZoneControl: ['',Validators.compose([Validators.required])],
      zoneControl: ['',Validators.compose([Validators.required])],
      dzoControl: ['',Validators.compose([Validators.required])]
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
