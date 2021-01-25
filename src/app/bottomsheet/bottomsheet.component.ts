import { Component, OnInit, Inject} from '@angular/core';
import { MatDialog } from '@angular/material';
import { MatBottomSheetRef, MAT_BOTTOM_SHEET_DATA} from '@angular/material/bottom-sheet';
import { Router } from '@angular/router';
import { RemarksDialogComponent } from '../remarks-dialog/remarks-dialog.component';
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
    private dialog: MatDialog,
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

  remarks(){
    const remarksDialog = this.dialog.open(RemarksDialogComponent,{
      width: '250px',
      data: "test"
    })
    remarksDialog.afterClosed().subscribe(result => {
      if(result !== undefined){
        console.log(result)
      }else{
        console.log("not submitted")
      }
    })

  }

}
