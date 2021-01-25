import { Component, OnInit } from '@angular/core';
import { Validators, FormBuilder, FormGroup } from '@angular/forms';
import { Router } from '@angular/router';
import { MatSnackBar } from '@angular/material';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {

  hide = true;
  loginForm: FormGroup;
  submitted = false;

  constructor(
    private router: Router,
    private fb: FormBuilder,
    private snackBar: MatSnackBar
  ) { }

  ngOnInit() {
    this.reactiveForm();
  }

  reactiveForm() {
    this.loginForm = this.fb.group({
      cid: ['', Validators.compose([Validators.required ])],
      password: ['', Validators.compose([Validators.required])]
    });

    this.loginForm.controls.cid.setValue(localStorage.getItem('loginId'));
  }

  login() {

    this.submitted = true;
    if (this.loginForm.valid) {
      const loginId = this.loginForm.get('cid').value;
      const password = this.loginForm.get('password').value;
      if(loginId === "321" && password === "321"){
        localStorage.setItem('isAuth',"true")
        localStorage.setItem('role',"view")
        this.router.navigate(['select'])
      }else if(loginId === "333" && password === "333"){
        localStorage.setItem('isAuth',"true")
        localStorage.setItem('role',"edit")
        this.router.navigate(['select'])
      }else{
        this.submitted = false;
        this.snackBar.open('Invalid login credentials, please try again', '', {
          duration: 5000,
          verticalPosition: 'bottom',
          panelClass: ['error-snackbar']
        });
      }


      
    }
  }
}