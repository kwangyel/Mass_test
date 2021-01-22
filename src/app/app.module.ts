import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import {
  MatToolbarModule,
  MatFormFieldModule,
  MatSelectModule,
  MatSnackBarModule,
  MatIconModule,
  MatDialogModule,
  MatBottomSheetModule,
  MatCardModule,
  MatChipsModule,
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


@NgModule({
  declarations: [
    AppComponent,
    SelectZoneComponent,
    MapComponent,
    ConfirmDialogComponent,
    BottomsheetComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    FormsModule,
    MatCardModule,
    MatChipsModule,
    ReactiveFormsModule,
    MatToolbarModule,
    HttpClientModule,
    MatFormFieldModule,
    MatBottomSheetModule,
    MatSelectModule,
    MatIconModule,
    MatSnackBarModule,
    MatDialogModule,
    BrowserAnimationsModule
  ],
  providers: [],
  bootstrap: [AppComponent],
  entryComponents:[ConfirmDialogComponent, BottomsheetComponent]
})
export class AppModule { }
