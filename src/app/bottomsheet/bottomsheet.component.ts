import { Component, OnInit, Inject} from '@angular/core';
import { MatBottomSheetRef, MAT_BOTTOM_SHEET_DATA} from '@angular/material/bottom-sheet';
import { Router } from '@angular/router';
import { DataService } from '../Services/data.service';

@Component({
  selector: 'app-bottomsheet',
  templateUrl: './bottomsheet.component.html',
  styleUrls: ['./bottomsheet.component.scss']
})
export class BottomsheetComponent implements OnInit {

  constructor(
    @Inject(MAT_BOTTOM_SHEET_DATA) public data: any,
    private _bottomSheetRef: MatBottomSheetRef<BottomsheetComponent>,
    private router: Router,
    private dataService: DataService
  ) { }

  ngOnInit() {
  }

  setProgress(){
    this.dataService.setProgress(this.data).subscribe(res=>{
      this._bottomSheetRef.dismiss()
      this.router.navigate(['map'])
    })
  }

  setComplete(){
    this.dataService.setComplete(this.data).subscribe(res=>{
      this._bottomSheetRef.dismiss()
      this.router.navigate(['map'])
    })

  }

  closeSheet(){
    this._bottomSheetRef.dismiss()
  }

}
