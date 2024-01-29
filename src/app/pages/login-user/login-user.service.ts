import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable, catchError, tap } from 'rxjs';
import { environment } from '../../../environments/environment';
import { ErrorHandlingService } from '../../shared/error-handling.service';
import { UserModel } from './user.model';
import { UserInterface } from '../../shared/interfaces/user.interface';
import { LoginInterface } from '../../shared/interfaces/login.interface';
import { ForgotPasswordInterface } from '../recover-password-user/interfaces/forgot-password.interface';
import { SsrCookieService } from 'ngx-cookie-service-ssr';

@Injectable({
  providedIn: 'root'
})
export class LoginUserService {
  user = new BehaviorSubject<any>(this.getStoredUser())
  userIsConnected:boolean = false
  userSesionId?:any;

  constructor(private http:HttpClient, private handleErrorService:ErrorHandlingService, private cookieService: SsrCookieService) { }

  private getStoredUser(): UserModel | null {
    const userToken = this.cookieService.get('user-token');
    return userToken ? new UserModel(userToken) : null;
  }

  loginUser(userData:LoginInterface):Observable<UserInterface> {
    return this.http.post<any>(`${environment.apiUrl}user/login`, userData).pipe(catchError(this.handleErrorService.handleError),
    tap(response => {
      this.userSesionId = response.userId
      this.userIsConnected = true
      this.cookieService.set('user-token', response.access_token)
      this.cookieService.set('user_id', response.userId.toString())
      const token = this.cookieService.get('user-token')
      const user = new UserModel(token)
      this.user!.next(user)
      this.cookieService.set('autoLoginUser', JSON.stringify(user))
    }))
  }

  forgotPassword(userData:ForgotPasswordInterface):Observable<UserInterface> {
    return this.http.post<any>(`${environment.apiUrl}user/forgot-password`, userData).pipe(catchError(this.handleErrorService.handleError));
  }

  userAutoLogin() {
    const userToken = this.cookieService.get('user-token')
    if(userToken) {
      const userData = userToken;
      const user = new UserModel(userData)
      if(user.token) {
        this.user!.next(user)
      } else {
        return;
      }
    }
  }

  logoutUser() {
    this.cookieService.delete('user-token')
    this.cookieService.delete('user_id')
    this.cookieService.delete('autoLoginUser')
  }
}
