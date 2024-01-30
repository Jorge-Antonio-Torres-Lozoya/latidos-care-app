import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { ErrorHandlingService } from '../../shared/error-handling.service';
import { RecoverPasswordUser } from './interfaces/recover-password-user.interface';
import { environment } from '../../../environments/environment';
import { Observable, catchError } from 'rxjs';
import { ValidatedVerificationTokenInterface } from '../../shared/interfaces/validate-verification-token.interface';
import { AccountInterface } from '../../shared/interfaces/account.interface';

@Injectable({
  providedIn: 'root'
})
export class RecoverPasswordUserService {

  constructor(private http:HttpClient, private errorHandlingService:ErrorHandlingService) { }

  recoverPassword(userId: string, userData:RecoverPasswordUser):Observable<AccountInterface> {
    return this.http.put<any>(`${environment.apiUrl}account/recover-password/${userId}`, userData).pipe(catchError(this.errorHandlingService.handleError));
  }

  validateVerificationTokenUser(userId:string, token:string):Observable<ValidatedVerificationTokenInterface>{
    return this.http.get<any>(`${environment.apiUrl}account/validate-recover-token/${userId}?recover-token=${token}`)
  }
}
