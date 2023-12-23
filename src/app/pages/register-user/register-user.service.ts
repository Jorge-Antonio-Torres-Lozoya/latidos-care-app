import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, catchError, tap} from 'rxjs';
import { environment } from '../../../environments/environment';
import { ErrorHandlingService } from '../../shared/error-handling.service';
import { SignupUserInterface } from './signup-user.interface';

@Injectable({
  providedIn: 'root'
})
export class SignupUserService {

  constructor(private http:HttpClient, private handleErrorService: ErrorHandlingService) { }

  signupUser(signupData: SignupUserInterface):Observable<any>{
    return this.http.post<any>(`${environment.apiUrl}user/signup`, signupData).pipe(catchError(this.handleErrorService.handleError))
  }
}
