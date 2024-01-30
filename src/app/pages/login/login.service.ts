import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { ErrorHandlingService } from '../../shared/error-handling.service';
import { SsrCookieService } from 'ngx-cookie-service-ssr';
import { BehaviorSubject, Observable, catchError, tap } from 'rxjs';
import { AccountModel } from '../../shared/account.model';
import { AccountInterface } from '../../shared/interfaces/account.interface';
import { environment } from '../../../environments/environment';
import { LoginInterface } from './interfaces/login.interface';
import { ForgotPasswordInterface } from '../recover-password-user/interfaces/forgot-password.interface';

@Injectable({
  providedIn: 'root'
})
export class LoginService {
  account = new BehaviorSubject<any>(this.getStoredAccount())
  activeRole = new BehaviorSubject<any>(this.getAccountRole())
  accountIsConnected:boolean = false
  accountSesionId?:any;

  constructor(
    private http:HttpClient,
    private errorHandlingService:ErrorHandlingService,
    private cookieService: SsrCookieService) {}


  private getStoredAccount(): AccountModel | null {
    const accountToken = this.cookieService.get('account-token');
    return accountToken ? new AccountModel(accountToken) : null;
  }

  private getAccountRole(): string | null {
    const accountRole = this.cookieService.get('account-role');
    return accountRole ? accountRole : null;
  }

login(accountData:LoginInterface):Observable<AccountInterface>{
  return this.http.post<any>(`${environment.apiUrl}account/login`, accountData).pipe(catchError(this.errorHandlingService.handleErrorService),
    tap(response => {
      this.accountSesionId = response.accountId
      this.accountIsConnected = true
      this.cookieService.set('account-token', response.access_token!)
      this.cookieService.set('account_id', response.accountId.toString())
      this.cookieService.set('account-role', response.activeRole!)
      this.activeRole.next(response.activeRole!)
      const token = this.cookieService.get('account-token')
      const account = new AccountModel(token)
      this.account!.next(account)
      this.cookieService.set('autoLoginAccount', JSON.stringify(account))
    }))
  }


  accountAutoLogin() {
    const accountToken = this.cookieService.get('account-token')
    if(accountToken) {
      const accountData = accountToken;
      const account = new AccountModel(accountData)
      if(account.token) {
        this.account!.next(account)
      } else {
        return;
      }
    }
  }

  forgotPassword(accountData:ForgotPasswordInterface):Observable<AccountInterface> {
    return this.http.post<any>(`${environment.apiUrl}account/forgot-password`, accountData).pipe(catchError(this.errorHandlingService.handleError));
  }

  logOutAccount() {
    this.cookieService.delete('account-token')
    this.cookieService.delete('account_id')
    this.cookieService.delete('account-role')
    this.cookieService.delete('autoLoginAccount')
  }

}
