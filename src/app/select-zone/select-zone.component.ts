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

  // subZones = [];
  // zones = [];
  // dzongkhags = [];
  dzongkhag:string;
  zoneForm: FormGroup;
  role = ""
  showSum = false


  dzongkhags = [];
  zones = [];
  subzones = [];
  selectDzongkhagForm: FormGroup;
  dzongkhagId: number = Number(sessionStorage.getItem("selectedDzongkhagId")) ? Number(sessionStorage.getItem("selectedDzongkhagId")) : null;
  zoneId: number;
  subzoneId: number;

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
  // getSubzones(zid){
  //   console.log(zid)
  //   this.dataService.getSubZones(zid).subscribe(res=>{
  //     this.subZones= res.data
  //   })
  // }

  // getZones(dzoId){
  //   this.dataService.getZones(dzoId).subscribe(res=>{
  //     this.zones = res.data
  //   })
  // }

  reactiveForm(){
    this.zoneForm = this.fb.group({
      subZoneControl: ['',Validators.compose([Validators.required])],
      zoneControl: ['',Validators.compose([Validators.required])],
      dzoControl: ['',Validators.compose([Validators.required])]
    })
  }

  getZoneList(dzo_id) {
    this.dataService.getZones(dzo_id).subscribe(res => {
      this.zones = res.data
    })
  }

  getSubZoneList(zoneId) {
    this.dataService.getSubZones(zoneId).subscribe(res => {
      this.subzones = res.data
      this.subzones.sort(function (a, b) {
        if (a.name < b.name) { return -1; }
        return 0;
      })
    })
  }

  submit(){
    if(this.dzongkhagId && this.subzoneId && this.zoneId){
      sessionStorage.setItem("zone",String(this.subzoneId))
      this.router.navigate(['map'])
    }
  }
}
