import { HttpClient, HttpHeaders, HttpParams } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { ErrorHandlingService } from "../../shared/error-handling.service";
import { BehaviorSubject, Observable, catchError } from "rxjs";
import { environment } from "../../../environments/environment";
import { UserInterface } from "../../shared/interfaces/user.interface";
import { UpdateCurrentValueInterface } from "../../shared/interfaces/update-current-value.interface";
import { MedicationInterface } from "../../shared/interfaces/medication.interface";
import { CreateMedicationInterface } from "../profile-admin/interfaces/create-medication.interface";
import { UpdateMedicationInterface } from "../../shared/interfaces/update-medication.interface";
import { SicknessInterface } from "../../shared/interfaces/sickness.interface";
import { CurrentValues } from "../../shared/interfaces/current-values.interface";
import { TreatmentInterface } from "../../shared/interfaces/new-treatment.interface";
import { ValidatedVerificationTokenInterface } from "../../shared/interfaces/validated-verification-token.interface";
import { VerificationTokenInterface } from "../../shared/interfaces/verification-token.interface";
import { TrackingValueInterface } from "../../shared/interfaces/tracking-value.interface";
import { CreateTrackingValueInterface } from "../profile-admin/interfaces/create-tracking-value.interface";
import { UpdateTrackingValueInterface } from "../../shared/interfaces/update-tracking-value.interface";
import { UpdateTrackingAlertsInterface } from "../../shared/interfaces/update-tracking-alerts.interface";
import { UpdateSicknessInterface } from "../../shared/interfaces/update-sickness.interface";
import { CreateSicknessInterface } from "../profile-admin/interfaces/create-sickness.interface";
import { AllergyInterface } from "../../shared/interfaces/allergy.interface";
import { CreateAllergyInterface } from "../profile-admin/interfaces/create-allergy.interface";
import { UpdateAllergyInterface } from "../../shared/interfaces/update-allergy.interface";
import { SsrCookieService } from "ngx-cookie-service-ssr";
@Injectable({
  providedIn: 'root'
})
export class ProfileUserService {
  displaySubject = new BehaviorSubject<string>('none');
  jwt = this.cookieService.get('user-token');
  headers = new HttpHeaders({
    Authorization: `Bearer ${this.jwt}`
  })
  private qrScanned = false;
  constructor(private http:HttpClient, private errorHandlingService:ErrorHandlingService, private cookieService: SsrCookieService) {}

setDisplay(display: string) {
    this.displaySubject.next(display);
  }

  setQrScanned(value: boolean): void {
    this.qrScanned = value;
  }

  getQrScanned(): boolean {
    return this.qrScanned;
  }

  //User

editUser(userData:any, idUser:string):Observable<UserInterface>{
    return this.http.put<any>(`${environment.apiUrl}user/${idUser}`, userData,  {headers: this.headers}).pipe(catchError(this.errorHandlingService.handleError))
  }

editUserPassword(userData:any, idUser:string):Observable<any>{
    return this.http.put(`${environment.apiUrl}user/change-password/${idUser}`, userData, {headers: this.headers}).pipe(catchError(this.errorHandlingService.handleError))
  }

getUser(idUser:string):Observable<UserInterface>{
    return this.http.get<any>(`${environment.apiUrl}user/${idUser}`).pipe(catchError(this.errorHandlingService.handleError))
  }

  //Tracking Values
getTrackingValuesByUser(userId:string, token?:string):Observable<TrackingValueInterface[]>{
  let params = new HttpParams();
  if(token) {
    params = params.append('token', token);
  }
  const options = {
    headers: this.headers,
    params: params
  };
    return this.http.get<any>(`${environment.apiUrl}tracking-value/by-user?userId=${userId}`, options).pipe(catchError(this.errorHandlingService.handleError))
  }
getTrackingValueById(trackingValueId:string, token?:string):Observable<TrackingValueInterface>{
  let params = new HttpParams();
  if(token) {
    params = params.append('token', token);
  }
  const options = {
    headers: this.headers,
    params: params
  };
    return this.http.get<any>(`${environment.apiUrl}tracking-value/${trackingValueId}`, options).pipe(catchError(this.errorHandlingService.handleError))
  }
createTrackingValue(trackingValueData:CreateTrackingValueInterface, token?:string):Observable<TrackingValueInterface>{
  let params = new HttpParams();
  if(token) {
    params = params.append('token', token);
  }
  const options = {
    headers: this.headers,
    params: params
  };
    return this.http.post<any>(`${environment.apiUrl}tracking-value`, trackingValueData, options).pipe(catchError(this.errorHandlingService.handleError))
  }
updateTrackingValue(trackingValueData:UpdateTrackingValueInterface, trackingValueId:string, token?:string):Observable<TrackingValueInterface>{
  let params = new HttpParams();
  if(token) {
    params = params.append('token', token);
  }
  const options = {
    headers: this.headers,
    params: params
  };
    return this.http.put<any>(`${environment.apiUrl}tracking-value/${trackingValueId}`, trackingValueData, options).pipe(catchError(this.errorHandlingService.handleError))
  }

updateTrackingAlerts(trackingValueData:UpdateTrackingAlertsInterface, trackingValueId:string, token?:string):Observable<TrackingValueInterface>{
  let params = new HttpParams();
  if(token) {
    params = params.append('token', token);
  }
  const options = {
    headers: this.headers,
    params: params
  };
    return this.http.put<any>(`${environment.apiUrl}tracking-value/alerts/${trackingValueId}`, trackingValueData, options).pipe(catchError(this.errorHandlingService.handleError))
  }

updateCurrentValue(trackingValueId:string, trackingValueData:UpdateCurrentValueInterface, token?:string):Observable<TrackingValueInterface>{
  let params = new HttpParams();
  if(token) {
    params = params.append('token', token);
  }
  const options = {
    headers: this.headers,
    params: params
  };
    return this.http.put<any>(`${environment.apiUrl}tracking-value/current-value/${trackingValueId}`, trackingValueData, options).pipe(catchError(this.errorHandlingService.handleError))
}
deleteTrackingValue(trackingValueId:string, token?:string):Observable<TrackingValueInterface>{
  let params = new HttpParams();
  if(token) {
    params = params.append('token', token);
  }
  const options = {
    headers: this.headers,
    params: params
  };
  return this.http.delete<any>(`${environment.apiUrl}tracking-value/${trackingValueId}`, options).pipe(catchError(this.errorHandlingService.handleError))
}

//Allergies
getAllergiesByUser(userId:string, token?:string):Observable<AllergyInterface[]>{
  let params = new HttpParams();
  if(token) {
    params = params.append('token', token);
  }
  const options = {
    headers: this.headers,
    params: params
  };
  return this.http.get<any>(`${environment.apiUrl}allergy/by-user?userId=${userId}`, options).pipe(catchError(this.errorHandlingService.handleError))
}
getAllergyById(allergyId:string, token?:string):Observable<AllergyInterface>{
  let params = new HttpParams();
  if(token) {
    params = params.append('token', token);
  }
  const options = {
    headers: this.headers,
    params: params
  };
  return this.http.get<any>(`${environment.apiUrl}allergy/${allergyId}`, options).pipe(catchError(this.errorHandlingService.handleError))
}
createAllergy(allergyData:CreateAllergyInterface, token?:string):Observable<AllergyInterface>{
  let params = new HttpParams();
  if(token) {
    params = params.append('token', token);
  }
  const options = {
    headers: this.headers,
    params: params
  };
  return this.http.post<any>(`${environment.apiUrl}allergy`, allergyData, options).pipe(catchError(this.errorHandlingService.handleError))
}
updateAllergy(allergyData:UpdateAllergyInterface, allergyId:string, token?:string):Observable<AllergyInterface>{
  let params = new HttpParams();
  if(token) {
    params = params.append('token', token);
  }
  const options = {
    headers: this.headers,
    params: params
  };
  return this.http.put<any>(`${environment.apiUrl}allergy/${allergyId}`, allergyData, options).pipe(catchError(this.errorHandlingService.handleError))
}
deleteAllergy(allergyId:string, token?:string):Observable<AllergyInterface>{
  let params = new HttpParams();
  if(token) {
    params = params.append('token', token);
  }
  const options = {
    headers: this.headers,
    params: params
  };
return this.http.delete<any>(`${environment.apiUrl}allergy/${allergyId}`, options).pipe(catchError(this.errorHandlingService.handleError))
}

//Medications

getMedicationById(medicationId:string, token?:string):Observable<MedicationInterface>{
  let params = new HttpParams();
  if(token) {
    params = params.append('token', token);
  }
  const options = {
    headers: this.headers,
    params: params
  };
  return this.http.get<any>(`${environment.apiUrl}medication/${medicationId}`, options ).pipe(catchError(this.errorHandlingService.handleError))
}

createMedication(medicationData:CreateMedicationInterface, token?:string):Observable<MedicationInterface>{
  let params = new HttpParams();
  if(token) {
    params = params.append('token', token);
  }
  const options = {
    headers: this.headers,
    params: params
  };
  return this.http.post<any>(`${environment.apiUrl}medication`, medicationData, options).pipe(catchError(this.errorHandlingService.handleError))

}
updateMedication(medicationData:UpdateMedicationInterface, medicationId:string, token?:string):Observable<MedicationInterface>{
  let params = new HttpParams();
  if(token) {
    params = params.append('token', token);
  }
  const options = {
    headers: this.headers,
    params: params
  };
  return this.http.put<any>(`${environment.apiUrl}medication/${medicationId}`, medicationData, options).pipe(catchError(this.errorHandlingService.handleError))

}
deleteMedication(medicationId:string, token?:string):Observable<MedicationInterface>{
  let params = new HttpParams();
  if(token) {
    params = params.append('token', token);
  }
  const options = {
    headers: this.headers,
    params: params
  };
  return this.http.delete<any>(`${environment.apiUrl}medication/${medicationId}`, options).pipe(catchError(this.errorHandlingService.handleError))
}
getAllSickness(token?:string):Observable<SicknessInterface[]>{
  let params = new HttpParams();
  if(token) {
    params = params.append('token', token);
  }
  const options = {
    headers: this.headers,
    params: params
  };
  return this.http.get<any>(`${environment.apiUrl}sickness`, options).pipe(catchError(this.errorHandlingService.handleError))
}
getAllSicknessByUser(userId:string, token?:string):Observable<SicknessInterface[]>{
  let params = new HttpParams();
  if(token) {
    params = params.append('token', token);
  }
  const options = {
    headers: this.headers,
    params: params
  };
  return this.http.get<any>(`${environment.apiUrl}sickness/by-user?userId=${userId}`, options).pipe(catchError(this.errorHandlingService.handleError))
}
createSickness(sicknessData:CreateSicknessInterface, token?:string):Observable<SicknessInterface>{
  let params = new HttpParams();
  if(token) {
    params = params.append('token', token);
  }
  const options = {
    headers: this.headers,
    params: params
  };
  return this.http.post<any>(`${environment.apiUrl}sickness`, sicknessData, options).pipe(catchError(this.errorHandlingService.handleError))

}
editSickness(sicknessData:UpdateSicknessInterface, idSickness:string, token?:string):Observable<SicknessInterface>{
  let params = new HttpParams();
  if(token) {
    params = params.append('token', token);
  }
  const options = {
    headers: this.headers,
    params: params
  };
  return this.http.put<any>(`${environment.apiUrl}sickness/${idSickness}`, sicknessData, options).pipe(catchError(this.errorHandlingService.handleError))

}
getSicknessById(idSickness:string, token?:string):Observable<SicknessInterface>{
  let params = new HttpParams();
  if(token) {
    params = params.append('token', token);
  }
  const options = {
    headers: this.headers,
    params: params
  };
  return this.http.get<any>(`${environment.apiUrl}sickness/${idSickness}`, options).pipe(catchError(this.errorHandlingService.handleError))
}
deleteSickness(idSickness:string, token?:string):Observable<any>{
  let params = new HttpParams();
  if(token) {
    params = params.append('token', token);
  }
  const options = {
    headers: this.headers,
    params: params
  };
  return this.http.delete<any>(`${environment.apiUrl}sickness/${idSickness}`, options).pipe(catchError(this.errorHandlingService.handleError))
}
getCurrentValueByDate(userId:string, startDate:string, endDate:string, token?:string):Observable<CurrentValues[]>{
  let params = new HttpParams()
  params = params.append('userId', userId);
  params = params.append('startDate', startDate);
  params = params.append('endDate', endDate);
  if(token) {
    params = params.append('token', token);
  }
  const options = {
    headers: this.headers,
    params: params
  };
  return this.http.get<any>(`${environment.apiUrl}current-value/between-dates`, options).pipe(catchError(this.errorHandlingService.handleError))
}
getTreatmentsByMedication(medicationId:string):Observable<TreatmentInterface[]> {
  return this.http.get<any>(`${environment.apiUrl}treatment/by-medication?medicationId=${medicationId}`, {headers: this.headers}).pipe(catchError(this.errorHandlingService.handleError))
}
getTreatmentsByDate(medicationId:string, startDate:string, endDate:string, token?:string):Observable<TreatmentInterface[]> {
  let params = new HttpParams()
  params = params.append('medicationId', medicationId);
  params = params.append('startDate', startDate);
  params = params.append('endDate', endDate);
  if(token) {
    params = params.append('token', token);
  }
  const options = {
    headers: this.headers,
    params: params
  };
  return this.http.get<any>(`${environment.apiUrl}treatment/between-dates`, options)
  .pipe(catchError(this.errorHandlingService.handleError))
}

getVerificationTokenUser(idUser:string):Observable<VerificationTokenInterface>{
  return this.http.get<any>(`${environment.apiUrl}user/${idUser}/verification-token`, {headers: this.headers}).pipe(catchError(this.errorHandlingService.handleError))
}

validateVerificationTokenUser(idUser:string, token:string):Observable<ValidatedVerificationTokenInterface>{
  return this.http.get<any>(`${environment.apiUrl}user/${idUser}/validate-verification-token?verification-token=${token}`)
}

generateVerificationTokenUser(idUser:string):Observable<VerificationTokenInterface>{
  return this.http.get<any>(`${environment.apiUrl}user/${idUser}/generate-verification-token`, {headers: this.headers}).pipe(catchError(this.errorHandlingService.handleError))
}

}
