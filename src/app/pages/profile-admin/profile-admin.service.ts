import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, catchError } from 'rxjs';
import { ErrorHandlingService } from '../../shared/error-handling.service';
import { environment } from '../../../environments/environment';
import { SicknessInterface } from '../../shared/interfaces/sickness.interface';
import { SsrCookieService } from 'ngx-cookie-service-ssr';

@Injectable({
  providedIn: 'root'
})
export class ProfileAdminService {
  displaySubject = new BehaviorSubject<string>('none');
  jwt = this.cookieService.get('admin-token');
  headers = new HttpHeaders({
    Authorization: `Bearer ${this.jwt}`
  })
  constructor(private http:HttpClient, private errorHandlingService:ErrorHandlingService, private cookieService: SsrCookieService) { }

  createSickness(sicknessData:any):Observable<SicknessInterface>{
    return this.http.post<any>(`${environment.apiUrl}sickness`, sicknessData, {headers: this.headers}).pipe(catchError(this.errorHandlingService.handleError))

  }
  editSickness(sicknessData:any, idSickness:string):Observable<SicknessInterface>{
    return this.http.put<any>(`${environment.apiUrl}sickness/${idSickness}`, sicknessData, {headers: this.headers}).pipe(catchError(this.errorHandlingService.handleError))

  }
  getAllSickness():Observable<SicknessInterface[]>{
    return this.http.get<any>(`${environment.apiUrl}sickness`, {headers: this.headers}).pipe(catchError(this.errorHandlingService.handleError))
  }

  getSicknessById(idSickness:string):Observable<SicknessInterface>{
    return this.http.get<any>(`${environment.apiUrl}sickness/${idSickness}`, {headers: this.headers}).pipe(catchError(this.errorHandlingService.handleError))
  }
  deleteSickness(idSickness:string):Observable<any>{
    return this.http.delete<any>(`${environment.apiUrl}sickness/${idSickness}`, {headers: this.headers}).pipe(catchError(this.errorHandlingService.handleError))
  }

}
