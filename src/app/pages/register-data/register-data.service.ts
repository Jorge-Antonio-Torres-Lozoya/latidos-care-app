import { HttpClient, HttpHeaders } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { ErrorHandlingService } from "../../shared/error-handling.service";
import { Observable, catchError } from "rxjs";
import { environment } from "../../../environments/environment";
import { SsrCookieService } from "ngx-cookie-service-ssr";
import { AccountInterface } from "../../shared/interfaces/account.interface";


@Injectable({
  providedIn: 'root'
})
export class RegisterDataService {
  getJwt() {
    return this.cookieService.get('account-token');
  }

  getHeaders() {
    const jwt = this.getJwt();
    return new HttpHeaders({
      Authorization: `Bearer ${jwt}`,
    });
  }

  constructor(private http:HttpClient, private errorHandlingService:ErrorHandlingService, private cookieService: SsrCookieService) {}

  updateRegisterDataAccount(accountId:string):Observable<AccountInterface>{
    return this.http.get<any>(`${environment.apiUrl}account/register-data/${accountId}`, {headers: this.getHeaders()}).pipe(catchError(this.errorHandlingService.handleError));
  }
}
