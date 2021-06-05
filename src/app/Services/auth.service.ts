import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { JwtHelperService } from '@auth0/angular-jwt';
import { BehaviorSubject } from 'rxjs';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  API_URL = environment.API_URL;
  public authState: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);

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
    }).pipe(
      map(
        data => {
          this.authState.next(true);
          return data;
      })); 
   }
  getAuthToken(){
    if(this.isAuthenticated()){
      return localStorage.getItem('token')
    }
  }
  logout() {
    localStorage.removeItem('token');
  }
}