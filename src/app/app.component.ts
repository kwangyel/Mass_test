import { Component, OnInit } from '@angular/core';
import { AuthService } from './Services/auth.service';
import { ConfirmDialogComponent } from './confirm-dialog/confirm-dialog.component';
import { MatDialog } from '@angular/material';
import { Router } from '@angular/router';
import {Location} from '@angular/common';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
  isUserLoggedIn: boolean;
  title = 'MassTesting';
  constructor(
    private authService: AuthService,
    private dialog: MatDialog,
    private router: Router,
    private location: Location
  ) {}

  ngOnInit() {
    this.authService.authState.subscribe(value => {
      this.isUserLoggedIn = value;
    });
  }
  logout() {
    const confirmDialog = this.dialog.open(ConfirmDialogComponent, {
      data: {
        title: 'Confirmation',
        message: 'Do you really want to logout?'
      }
    });
    confirmDialog.afterClosed().subscribe(result => {
      if (result) {
        this.authService.logout();
        this.router.navigate(['login']);
      }
    });
  }

  back() {
    if (this.router.url === '/selectzone') {
      this.logout();
    } else {
      this.location.back();
    }
  }
}
