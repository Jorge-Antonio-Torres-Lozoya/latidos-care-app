import { HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { throwError } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ErrorHandlingService {

  constructor() { }

  public handleError(errorRes:HttpErrorResponse){
    let errorMessage = 'Ocurrio un error con los datos, por favor intenta de nuevo.'
    console.log(errorRes)
    if(errorRes.error.message){
      errorMessage = errorRes.error.message
    }
    if(errorRes.error){
      return throwError(errorMessage)
    }
    return throwError(errorMessage)
  }

  public handleErrorService(errorRes:HttpErrorResponse){
    let errorMessage = 'Ocurrio un error con los datos, por favor intenta de nuevo.'
    console.log(errorRes)
    if(errorRes.error){
      return throwError(errorMessage)
    }
    return throwError(errorMessage)
  }
}
