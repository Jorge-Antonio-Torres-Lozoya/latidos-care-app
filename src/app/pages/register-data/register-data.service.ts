import { HttpClient, HttpHeaders } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { ErrorHandlingService } from "../../shared/error-handling.service";
import { Observable, catchError } from "rxjs";
import { UserInterface } from "../../shared/interfaces/user.interface";
import { environment } from "../../../environments/environment";
import { SsrCookieService } from "ngx-cookie-service-ssr";


@Injectable({
  providedIn: 'root'
})
export class RegisterDataService {
  jwt = this.cookieService.get('user-token');
  headers = new HttpHeaders({
    Authorization: `Bearer ${this.jwt}`
  })

  constructor(private http:HttpClient, private errorHandlingService:ErrorHandlingService, private cookieService: SsrCookieService) {}

  updateRegisterDataUser(userId:string):Observable<UserInterface>{
    return this.http.put<any>(`${environment.apiUrl}user/register-data/${userId}`, null, {headers: this.headers}).pipe(catchError(this.errorHandlingService.handleError));
  }
}
