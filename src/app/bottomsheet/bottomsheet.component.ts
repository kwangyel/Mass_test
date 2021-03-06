import { Component, OnInit, Inject} from '@angular/core';
import { MatDialog } from '@angular/material';
import { MatBottomSheetRef, MAT_BOTTOM_SHEET_DATA} from '@angular/material/bottom-sheet';
import { Router } from '@angular/router';
import { ThemeService } from 'ng2-charts';
import { RemarksDialogComponent } from '../remarks-dialog/remarks-dialog.component';
import { DataService } from '../Services/data.service';

@Component({
  selector: 'app-bottomsheet',
  templateUrl: './bottomsheet.component.html',
  styleUrls: ['./bottomsheet.component.scss']
})
export class BottomsheetComponent implements OnInit {
  showedit = null

  constructor(
    @Inject(MAT_BOTTOM_SHEET_DATA) public data: any,
    private _bottomSheetRef: MatBottomSheetRef<BottomsheetComponent>,
    private router: Router,
    private dialog: MatDialog,
    private dataService: DataService
  ) { }

  ngOnInit() {
    this.showedit = this.data.showEdit;
  }

  setProgress(){
    this.dataService.setProgress(this.data.building_id).subscribe(res=>{
      this._bottomSheetRef.dismiss()
      this.router.navigate(['map'])
    })
  }

  setComplete(){
    this.dataService.setComplete(this.data.building_id).subscribe(res=>{
      this._bottomSheetRef.dismiss()
      this.router.navigate(['map'])
    })

  }
  show(){
    this._bottomSheetRef.dismiss()
    this.router.navigate(['dashboard',this.data.building_id]);
  }

  closeSheet(){
    this._bottomSheetRef.dismiss()
  }

  remarks(){
    const remarksDialog = this.dialog.open(RemarksDialogComponent,{
      width: '250px'
    })
    remarksDialog.afterClosed().subscribe(result => {
      if(result !== undefined){
        let obj = {
          structure_id: this.data.building_id,
          remarks: result
        }
        this.dataService.postRemarks(obj).subscribe(res=>{
          if(res.success === "true"){
            console.log("remarks submitted successfully")
            this._bottomSheetRef.dismiss()
          }else{
            console.log(res)
          }
        })
      }else{
        console.log("not submitted")
      }
    })

  }

}
