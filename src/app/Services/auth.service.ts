import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { JwtHelperService } from '@auth0/angular-jwt';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  API_URL = environment.API_URL;

  constructor(
    private http: HttpClient,
    private jwtHelper: JwtHelperService
  ) {}
  // ...
  public isAuthenticated(): boolean {
    const token = localStorage.getItem('token')
    // Check whether the token is expired and return
    // true or false
    return !this.jwtHelper.isTokenExpired(token)
  }
  login(cid, password){
    return this.http.post<any>(`${this.API_URL}/login`,{
      cid: cid,
      password: password
    }) 
   }
  getAuthToken(){
    if(this.isAuthenticated()){
      return localStorage.getItem('token')
    }
  }
}