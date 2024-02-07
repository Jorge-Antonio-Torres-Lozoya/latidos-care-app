import { HttpClient, HttpHeaders, HttpParams } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { ErrorHandlingService } from "../../shared/error-handling.service";
import { Observable, catchError } from "rxjs";
import { environment } from "../../../environments/environment";
import { VerificationTokenInterface } from "../../shared/interfaces/verification-token.interface";
import { SsrCookieService } from "ngx-cookie-service-ssr";
import { AccountInterface } from "../../shared/interfaces/account.interface";
import { ChangePasswordInterface } from "./interfaces/change-password.interface";
import { UserTrackingValueInterface } from "../../shared/interfaces/user-tracking-value.interface";
import { UserAllergyInterface } from "../../shared/interfaces/user-allergy.interface";
import { MedicationSicknessInterface } from "../../shared/interfaces/medication-sickness.interface";
import { UserSicknessInterface } from "../../shared/interfaces/user-sickness.interface";
import { CurrentValueInterface } from "../../shared/interfaces/current-value.interface";
import { TreatmentInterface } from "../../shared/interfaces/treatment.interface";
import { ValidatedVerificationTokenInterface } from "../../shared/interfaces/validate-verification-token.interface";
import { CreateMedicationSicknessInterface } from "../../shared/interfaces/create-medication-sickness.interface";
import { UpdateMedicationSicknessInterface } from "../../shared/interfaces/update-medication-sickness.interface";
import { CreateUserAllergyInterface } from "../../shared/interfaces/create-user-allergy.interface";
import { CreateUserSicknessInterface } from "../../shared/interfaces/create-user-sickness.interface";
import { CreateUserTrackingValueInterface } from "../../shared/interfaces/create-user-tracking-value.interface";
import { UpdateUserTrackingValueInterface } from "../../shared/interfaces/update-user-trackin-value.interface";
@Injectable({
  providedIn: 'root'
})
export class ProfileUserService {
  getJwt() {
    return this.cookieService.get('account-token');
  }

  getHeaders() {
    const jwt = this.getJwt();
    return new HttpHeaders({
      Authorization: `Bearer ${jwt}`,
    });
  }
  private qrScanned = false;
  constructor(private http:HttpClient, private errorHandlingService:ErrorHandlingService, private cookieService: SsrCookieService) {}

  setQrScanned(value: boolean): void {
    this.qrScanned = value;
  }

  getQrScanned(): boolean {
    return this.qrScanned;
  }

  changePassword(accountId: string, passwordData:ChangePasswordInterface):Observable<AccountInterface>{
    return this.http.put<any>(`${environment.apiUrl}account/change-password/${accountId}`, passwordData, {
      headers: this.getHeaders(),
    }).pipe(catchError(this.errorHandlingService.handleError))
  }

  //Tracking Values
  getUserTrackingValuesByAccount(accountId: string, token?:string):Observable<UserTrackingValueInterface[]>{
    let params = new HttpParams();
    if(token) {
      params = params.append('token', token);
    }
    const options = {
      headers: this.getHeaders(),
      params: params
    };
    return this.http.get<any>(`${environment.apiUrl}user-tracking-value/by-account?accountId=${accountId}`, options).pipe(catchError(this.errorHandlingService.handleError))
  }

  createUserTrackingValue(trackingValueData:CreateUserTrackingValueInterface, accountId: string,  token?:string):Observable<UserTrackingValueInterface>{
    let params = new HttpParams();
    if(token) {
      params = params.append('token', token);
      params = params.append('accountId', accountId);
    }
    const options = {
      headers: this.getHeaders(),
      params: params
    };
    return this.http.post<any>(`${environment.apiUrl}user-tracking-value`, trackingValueData, options).pipe(catchError(this.errorHandlingService.handleError))
  }
updateUserTrackingValue(userTrackingValueId:string, trackingValueData:UpdateUserTrackingValueInterface, accountId: string,  token?:string):Observable<UserTrackingValueInterface>{
  let params = new HttpParams();
  if(token) {
    params = params.append('token', token);
    params = params.append('accountId', accountId);
  }
  const options = {
    headers: this.getHeaders(),
    params: params
  };
    return this.http.put<any>(`${environment.apiUrl}user-tracking-value/${userTrackingValueId}`, trackingValueData, options).pipe(catchError(this.errorHandlingService.handleError))
  }

deleteUserTrackingValue(userTrackingValueId:string, accountId: string, token?:string):Observable<UserTrackingValueInterface>{
  let params = new HttpParams();
  if(token) {
    params = params.append('token', token);
    params = params.append('accountId', accountId);
  }
  const options = {
    headers: this.getHeaders(),
    params: params
  };
  return this.http.delete<any>(`${environment.apiUrl}user-tracking-value/${userTrackingValueId}`, options).pipe(catchError(this.errorHandlingService.handleError))
}

//Allergies
getUserAllergiesByAccount(accountId:string, token?:string):Observable<UserAllergyInterface[]>{
  let params = new HttpParams();
  if(token) {
    params = params.append('token', token);
  }
  const options = {
    headers: this.getHeaders(),
    params: params
  };
  return this.http.get<any>(`${environment.apiUrl}user-allergy/by-account?accountId=${accountId}`, options).pipe(catchError(this.errorHandlingService.handleError))
}

getUserAllergyById(userAllergyId:string, accountId: string, token?:string):Observable<UserAllergyInterface>{
  let params = new HttpParams();
  if(token) {
    params = params.append('token', token);
    params = params.append('accountId', accountId);
  }
  const options = {
    headers: this.getHeaders(),
    params: params
  };
  return this.http.get<any>(`${environment.apiUrl}user-allergy/${userAllergyId}`, options).pipe(catchError(this.errorHandlingService.handleError))

}
createUserAllergy(allergyData:CreateUserAllergyInterface, accountId: string, token?:string):Observable<UserAllergyInterface>{
  let params = new HttpParams();
  if(token) {
    params = params.append('token', token);
    params = params.append('accountId', accountId);
  }
  const options = {
    headers: this.getHeaders(),
    params: params
  };
  return this.http.post<any>(`${environment.apiUrl}user-allergy`, allergyData, options).pipe(catchError(this.errorHandlingService.handleError))
}

deleteUserAllergy(userAllergyId:string, accountId: string, token?:string):Observable<UserAllergyInterface>{
  let params = new HttpParams();
  if(token) {
    params = params.append('token', token);
    params = params.append('accountId', accountId);
  }
  const options = {
    headers: this.getHeaders(),
    params: params
  };
return this.http.delete<any>(`${environment.apiUrl}user-allergy/${userAllergyId}`, options).pipe(catchError(this.errorHandlingService.handleError))
}

//Medications
getMedicationSicknessByAccount(accountId:string, token?:string):Observable<MedicationSicknessInterface[]>{
  let params = new HttpParams();
  if(token) {
    params = params.append('token', token);
  }
  const options = {
    headers: this.getHeaders(),
    params: params
  };
  return this.http.get<any>(`${environment.apiUrl}medication-sickness/by-account?accountId=${accountId}`, options).pipe(catchError(this.errorHandlingService.handleError))
}

getMedicationSicknessBySlug(slug:string, accountId: string, token?:string):Observable<MedicationSicknessInterface>{
  let params = new HttpParams();
  if(token) {
    params = params.append('token', token);
    params = params.append('accountId', accountId);
  }
  const options = {
    headers: this.getHeaders(),
    params: params
  };
  return this.http.get<any>(`${environment.apiUrl}medication-sickness/by-slug/${slug}`, options ).pipe(catchError(this.errorHandlingService.handleError))
}

createMedicationSickness(medicationData:CreateMedicationSicknessInterface, accountId: string, token?:string):Observable<MedicationSicknessInterface>{
  let params = new HttpParams();
  if(token) {
    params = params.append('token', token);
    params = params.append('accountId', accountId);
  }
  const options = {
    headers: this.getHeaders(),
    params: params
  };
  return this.http.post<any>(`${environment.apiUrl}medication-sickness`, medicationData, options).pipe(catchError(this.errorHandlingService.handleError))

}

updateMedicationSickness(medicationSicknessId:string, medicationData:UpdateMedicationSicknessInterface, accountId: string, token?:string):Observable<MedicationSicknessInterface>{
  let params = new HttpParams();
  if(token) {
    params = params.append('token', token);
    params = params.append('accountId', accountId);
  }
  const options = {
    headers: this.getHeaders(),
    params: params
  };
  return this.http.put<any>(`${environment.apiUrl}medication-sickness/${medicationSicknessId}`, medicationData, options).pipe(catchError(this.errorHandlingService.handleError))

}
deleteMedicationSickness(medicationSicknessId:string, accountId: string, token?:string):Observable<MedicationSicknessInterface>{
  let params = new HttpParams();
  if(token) {
    params = params.append('token', token);
    params = params.append('accountId', accountId);
  }
  const options = {
    headers: this.getHeaders(),
    params: params
  };
  return this.http.delete<any>(`${environment.apiUrl}medication-sickness/${medicationSicknessId}`, options).pipe(catchError(this.errorHandlingService.handleError))
}

//Sickness
getAllUserSicknessByAccount(accountId:string, token?:string):Observable<UserSicknessInterface[]>{
  let params = new HttpParams();
  if(token) {
    params = params.append('token', token);
  }
  const options = {
    headers: this.getHeaders(),
    params: params
  };
  return this.http.get<any>(`${environment.apiUrl}user-sickness/by-user?accountId=${accountId}`, options).pipe(catchError(this.errorHandlingService.handleError))
}
createUserSickness(sicknessData:CreateUserSicknessInterface, accountId: string, token?:string):Observable<UserSicknessInterface>{
  let params = new HttpParams();
  if(token) {
    params = params.append('token', token);
    params = params.append('accountId', accountId);
  }
  const options = {
    headers: this.getHeaders(),
    params: params
  };
  return this.http.post<any>(`${environment.apiUrl}user-sickness`, sicknessData, options).pipe(catchError(this.errorHandlingService.handleError))

}

deleteUserSickness(userSicknessId:string, accountId: string, token?:string):Observable<UserSicknessInterface>{
  let params = new HttpParams();
  if(token) {
    params = params.append('token', token);
    params = params.append('accountId', accountId);
  }
  const options = {
    headers: this.getHeaders(),
    params: params
  };
  return this.http.delete<any>(`${environment.apiUrl}user-sickness/${userSicknessId}`, options).pipe(catchError(this.errorHandlingService.handleError))
}

getCurrentValueByDate(accountId:string, startDate:string, endDate:string, token?:string):Observable<CurrentValueInterface[]>{
  let params = new HttpParams()
  params = params.append('accountId', accountId);
  params = params.append('startDate', startDate);
  params = params.append('endDate', endDate);
  if(token) {
    params = params.append('token', token);
  }
  const options = {
    headers: this.getHeaders(),
    params: params
  };
  return this.http.get<any>(`${environment.apiUrl}current-value/between-dates`, options).pipe(catchError(this.errorHandlingService.handleError))
}

getTreatmentsByMedication(medicationId:string, accountId: string, token?:string):Observable<TreatmentInterface[]> {
  let params = new HttpParams();
    params = params.append('medicationId', medicationId);
    params = params.append('accountId', accountId);
    if(token) {
      params = params.append('token', token);
    }
  const options = {
    headers: this.getHeaders(),
    params: params
  };
  return this.http.get<any>(`${environment.apiUrl}treatment/by-medication`, options).pipe(catchError(this.errorHandlingService.handleError))
}

getTreatmentsByDate(medicationId:string, startDate:string, endDate:string, accountId: string, token?:string):Observable<TreatmentInterface[]> {
  let params = new HttpParams()
  params = params.append('medicationId', medicationId);
  params = params.append('startDate', startDate);
  params = params.append('endDate', endDate);
  params = params.append('accountId', accountId);
  if(token) {
    params = params.append('token', token);
  }
  const options = {
    headers: this.getHeaders(),
    params: params
  };
  return this.http.get<any>(`${environment.apiUrl}treatment/between-dates`, options)
  .pipe(catchError(this.errorHandlingService.handleError))
}

  getVerificationTokenAccount(accountId:string):Observable<VerificationTokenInterface>{
    return this.http.get<any>(`${environment.apiUrl}account/verification-token/${accountId}`, {headers: this.getHeaders()}).pipe(catchError(this.errorHandlingService.handleError))
  }

  validateVerificationTokenAccount(accountId:string, token:string):Observable<ValidatedVerificationTokenInterface>{
    return this.http.get<any>(`${environment.apiUrl}account/validate-verification-token/${accountId}?verification-token=${token}`)
  }

  generateVerificationTokenAccount(accountId:string):Observable<VerificationTokenInterface>{
    return this.http.get<any>(`${environment.apiUrl}account/generate-verification-token/${accountId}`, {headers: this.getHeaders()}).pipe(catchError(this.errorHandlingService.handleError))
  }
}
