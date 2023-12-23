import { HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { throwError } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ErrorHandlingService {

  constructor() { }

  public handleError(errorRes:HttpErrorResponse){
    let errorMessage = 'There was an error with the data, please try again.'
    console.log(errorRes)
    if(!errorRes.error){
      return throwError(errorMessage)
    }
    if(errorRes.error.message){
      errorMessage = errorRes.error.message
    }
    return throwError(errorMessage)
  }

  public handleErrorService(errorRes:HttpErrorResponse){
    let errorMessage = 'There was an error with the data, please try again.'
    console.log(errorRes)
    if(!errorRes.error){
      return throwError(errorMessage)
    }
    return throwError(errorMessage)
  }
}
