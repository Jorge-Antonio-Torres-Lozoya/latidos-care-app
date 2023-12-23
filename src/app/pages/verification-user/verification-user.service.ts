import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { ErrorHandlingService } from '../../shared/error-handling.service';
import { Observable, catchError } from 'rxjs';
import { environment } from '../../../environments/environment';
import { VerificationUserInterface } from '../../shared/interfaces/verify-user.interface';

@Injectable({
  providedIn: 'root'
})
export class VerificationUserService {

  constructor(private http:HttpClient, private errorHandlingService:ErrorHandlingService) { }

  verifyUser(memberData:VerificationUserInterface):Observable<any>{
    return this.http.put<any>(`${environment.apiUrl}user/verification`, memberData).pipe(catchError(this.errorHandlingService.handleError));
  }
}
