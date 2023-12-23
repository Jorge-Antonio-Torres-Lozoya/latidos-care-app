import { Injectable } from '@angular/core';
import { UserInterface } from '../../shared/interfaces/user.interface';
import { HttpClient } from '@angular/common/http';
import { ErrorHandlingService } from '../../shared/error-handling.service';
import { RecoverPasswordUser } from '../../shared/interfaces/recover-password-user.interface';
import { environment } from '../../../environments/environment';
import { Observable, catchError } from 'rxjs';
import { ValidatedVerificationTokenInterface } from '../../shared/interfaces/validated-verification-token.interface';

@Injectable({
  providedIn: 'root'
})
export class RecoverPasswordUserService {

  constructor(private http:HttpClient, private errorHandlingService:ErrorHandlingService) { }

  recoverPassword(userId: string, userData:RecoverPasswordUser):Observable<UserInterface> {
    return this.http.put<any>(`${environment.apiUrl}user/recover-password/${userId}`, userData).pipe(catchError(this.errorHandlingService.handleError));
  }

  validateVerificationTokenUser(userId:string, token:string):Observable<ValidatedVerificationTokenInterface>{
    return this.http.get<any>(`${environment.apiUrl}user/validate-recover-token/${userId}?recover-token=${token}`)
  }
}
