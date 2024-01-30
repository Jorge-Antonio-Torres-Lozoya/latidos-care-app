import { HttpClient, HttpHeaders } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { ErrorHandlingService } from "./error-handling.service";
import { SsrCookieService } from "ngx-cookie-service-ssr";
import { AccountInterface } from "./interfaces/account.interface";
import { Observable, catchError } from "rxjs";
import { environment } from "../../environments/environment";
import { UpdateAccountInterface } from "./interfaces/update-account.interface";


@Injectable({
  providedIn: 'root',
})
export class SharedService {
  getJwt() {
    return this.cookieService.get('account-token');
  }

  getHeaders() {
    const jwt = this.getJwt();
    return new HttpHeaders({
      Authorization: `Bearer ${jwt}`,
    });
  }

  constructor(
    private http: HttpClient,
    private errorHandlingService: ErrorHandlingService,
    private cookieService: SsrCookieService
  ) {}

  getAllAccounts(): Observable<AccountInterface[]> {
    return this.http
      .get<any>(`${environment.apiUrl}account`)
      .pipe(catchError(this.errorHandlingService.handleError));
  }

  getAccountById(accountId: string): Observable<AccountInterface> {
    return this.http
      .get<any>(`${environment.apiUrl}account/${accountId}`)
      .pipe(catchError(this.errorHandlingService.handleError));
  }

  getAccountBySlug(slug: string): Observable<AccountInterface> {
    return this.http
      .get<any>(`${environment.apiUrl}account/by-slug/${slug}`)
      .pipe(catchError(this.errorHandlingService.handleError));
  }

  updateAccount(
    accountId: string,
    accountData: UpdateAccountInterface
  ): Observable<AccountInterface> {
    return this.http
      .put<any>(`${environment.apiUrl}account/${accountId}`, accountData, {
        headers: this.getHeaders(),
      })
      .pipe(catchError(this.errorHandlingService.handleError));
  }

}
