import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { ErrorHandlingService } from '../../shared/error-handling.service';
import { MedicationInterface } from '../../shared/interfaces/medication.interface';
import { environment } from '../../../environments/environment';
import { Observable, catchError } from 'rxjs';
import { CreateTreatmentInterface } from '../../shared/interfaces/create-treatment.interface';
// import { Treatment } from '../../shared/interfaces/treatment.interface';

@Injectable({
  providedIn: 'root'
})
export class ConfirmTreatmentService {

  constructor(private http:HttpClient, private errorHandlingService:ErrorHandlingService) { }

  getMedicationById(userSicknessId:string):Observable<MedicationInterface>{
    return this.http.get<any>(`${environment.apiUrl}medication/${userSicknessId}`).pipe(catchError(this.errorHandlingService.handleError))
  }

  // createTreatment(treatmentData:CreateTreatmentInterface):Observable<Treatment> {
  //   return this.http.post<any>(`${environment.apiUrl}treatment`, treatmentData).pipe(catchError(this.errorHandlingService.handleError))
  // }
}
