import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  constructor() {}
  // ...
  public isAuthenticated(): boolean {
    const isAuth = localStorage.getItem('isAuth');
    // Check whether the token is expired and return
    // true or false
    return isAuth === "true";
  }
}