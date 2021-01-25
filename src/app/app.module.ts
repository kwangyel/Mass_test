import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { MatTableModule } from '@angular/material'  

import {
  MatToolbarModule,
  MatProgressBarModule,
  MatFormFieldModule,
  MatSelectModule,
  MatSnackBarModule,
  MatIconModule,
  MatDialogModule,
  MatBottomSheetModule,
  MatCardModule,
  MatChipsModule,
  MatInputModule,
  MatTabsModule
} from '@angular/material';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { SelectZoneComponent } from './select-zone/select-zone.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MapComponent } from './map/map.component';
import { HttpClientModule } from '@angular/common/http';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ConfirmDialogComponent } from './confirm-dialog/confirm-dialog.component';
import { BottomsheetComponent } from './bottomsheet/bottomsheet.component';
import { LoginComponent } from './login/login.component';
import { SummaryDashComponent } from './summary-dash/summary-dash.component';
import { ChartsModule } from 'ng2-charts';
import { NgApexchartsModule } from 'ng-apexcharts';

@NgModule({
  declarations: [
    AppComponent,
    SelectZoneComponent,
    MapComponent,
    ConfirmDialogComponent,
    BottomsheetComponent,
    LoginComponent,
    SummaryDashComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    NgApexchartsModule,
    FormsModule,
    MatCardModule,
    MatChipsModule,
    MatInputModule,
    ReactiveFormsModule,
    MatToolbarModule,
    HttpClientModule,
    MatFormFieldModule,
    MatBottomSheetModule,
    MatSelectModule,
    MatIconModule,
    MatSnackBarModule,
    MatDialogModule,
    BrowserAnimationsModule,
    MatTabsModule,
    MatTableModule,
    ChartsModule,
    MatProgressBarModule
  ],
  providers: [],
  bootstrap: [AppComponent],
  entryComponents:[ConfirmDialogComponent, BottomsheetComponent]
})
export class AppModule { }
