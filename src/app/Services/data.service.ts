import { HttpClient, HttpErrorResponse, HttpHeaders } from '@angular/common/http';
import { throwError } from 'rxjs';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { catchError } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class DataService {
  API_URL = environment.API_URL;
  HPI_URL = environment.HPI_URL;

  constructor(
    private http: HttpClient
  ) { }

  httpOptions = {
    headers: new HttpHeaders({
      'Content-Type': 'application/json'
    })
  };

  // Handle API errors
  handleError(error: HttpErrorResponse) {
    if (error.error instanceof ErrorEvent) {
      // A client-side or network error occurred. Handle it accordingly.
      console.error('An error occurred:', error.error.message);
    } else {
      // The backend returned an unsuccessful response code.
      // The response body may contain clues as to what went wrong,
      console.error(
        `Backend returned code ${error.status}, ` +
        `body was: ${error.error}`);
    }
    // return an observable with a user-facing error message
    return throwError(
      'Something bad happened; please try again later.');
  }

  getAllZones(){
    return this.http
      .get<any>(`${this.API_URL}/get-all-zones`,this.httpOptions)
      .pipe(
        catchError(this.handleError)
      )
  }
  getSubZones(zid){
    return this.http
      .get<any>(`${this.API_URL}/get-subzones/${zid}`,this.httpOptions)
      .pipe(
        catchError(this.handleError)
      )
  }
  getZones(dzoId){
    return this.http
      .get<any>(`${this.API_URL}/get-zones/${dzoId}`,this.httpOptions)
      .pipe(
        catchError(this.handleError)
      )
  }
  getAllDzo(){
    return this.http
      .get<any>(`${this.API_URL}/get-all-dzo`,this.httpOptions)
      .pipe(
        catchError(this.handleError)
      )
  }

  setProgress(sid){
    return this.http
      .get<any>(`${this.API_URL}/markProgress/${sid}`,this.httpOptions)
      .pipe(
        catchError(this.handleError)
      )
  }

  setComplete(sid){
    return this.http
      .get<any>(`${this.API_URL}/markComplete/${sid}`,this.httpOptions)
      .pipe(
        catchError(this.handleError)
      )
  }
  
  postNewBuilding(item){
    return this.http
      .post<any>(`${this.API_URL}/create-str`, item, this.httpOptions)
      .pipe(
        catchError(this.handleError)
      );
  }

  postRemarks(item){
    return this.http
      .post<any>(`${this.API_URL}/setRemarks`, item, this.httpOptions)
      .pipe(
        catchError(this.handleError)
      );
  }

  getHouseholds(sid){
    return this.http
      .get<any>(`${this.HPI_URL}/household/get-all/${sid}`,this.httpOptions)
      .pipe(
        catchError(this.handleError)
      )
  }

  getFamilyMembers(hhid){
    return this.http
    .get<any>(`${this.HPI_URL}/member/get-all/${hhid}`,this.httpOptions)
    .pipe(
      catchError(this.handleError)
    )
  }

  updateMember(data){
    return this.http
    .patch<any>(`${this.HPI_URL}/member/update`,data,this.httpOptions)
    .pipe(
      catchError(this.handleError)
    )
  }
}