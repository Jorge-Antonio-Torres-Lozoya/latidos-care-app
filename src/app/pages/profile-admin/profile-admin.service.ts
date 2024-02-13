import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, catchError } from 'rxjs';
import { ErrorHandlingService } from '../../shared/error-handling.service';
import { environment } from '../../../environments/environment';
import { SicknessInterface } from '../../shared/interfaces/sickness.interface';
import { SsrCookieService } from 'ngx-cookie-service-ssr';
import { AccountInterface } from '../../shared/interfaces/account.interface';
import { RoleInterface } from '../../shared/interfaces/role.interface';
import { AddRoleToAccount } from './interfaces/add-role-to-account.interface';
import { SignupInterface } from '../../shared/interfaces/signup.interface';
import { AllergyInterface } from '../../shared/interfaces/allergy.interface';
import { CreateAllergyInterface } from './interfaces/create-allergy.interface';
import { TrackingValueInterface } from '../../shared/interfaces/tracking-value.interface';
import { CreateTrackingValueInterface } from './interfaces/create-tracking-value.interface';
import { UpdateSicknessInterface } from '../../shared/interfaces/update-sickness.interface';
import { UpdateAllergyInterface } from '../../shared/interfaces/update-allergy.interface';
import { UpdateTrackingValueInterface } from '../../shared/interfaces/update-tracking-value.interface';
import { MedicationInterface } from '../../shared/interfaces/medication.interface';
import { CreateMedicationInterface } from './interfaces/create-medication.interface';
import { UpdateMedicationInterface } from '../../shared/interfaces/update-medication.interface';

@Injectable({
  providedIn: 'root',
})
export class ProfileAdminService {
  displaySubject = new BehaviorSubject<string>('none');
  jwt = this.cookieService.get('account-token');
  headers = new HttpHeaders({
    Authorization: `Bearer ${this.jwt}`,
  });
  constructor(
    private http: HttpClient,
    private errorHandlingService: ErrorHandlingService,
    private cookieService: SsrCookieService
  ) {}

  createSickness(sicknessData: any): Observable<SicknessInterface> {
    return this.http
      .post<any>(`${environment.apiUrl}sickness`, sicknessData, {
        headers: this.headers,
      })
      .pipe(catchError(this.errorHandlingService.handleError));
  }
  editSickness(
    sicknessData: UpdateSicknessInterface,
    idSickness: string
  ): Observable<SicknessInterface> {
    return this.http
      .put<any>(`${environment.apiUrl}sickness/${idSickness}`, sicknessData, {
        headers: this.headers,
      })
      .pipe(catchError(this.errorHandlingService.handleError));
  }
  getAllSickness(): Observable<SicknessInterface[]> {
    return this.http
      .get<any>(`${environment.apiUrl}sickness`, { headers: this.headers })
      .pipe(catchError(this.errorHandlingService.handleError));
  }

  getSicknessById(idSickness: string): Observable<SicknessInterface> {
    return this.http
      .get<any>(`${environment.apiUrl}sickness/${idSickness}`, {
        headers: this.headers,
      })
      .pipe(catchError(this.errorHandlingService.handleError));
  }
  deleteSickness(idSickness: string): Observable<any> {
    return this.http
      .delete<any>(`${environment.apiUrl}sickness/${idSickness}`, {
        headers: this.headers,
      })
      .pipe(catchError(this.errorHandlingService.handleError));
  }

  // Account
  getAllAccounts(): Observable<AccountInterface[]> {
    return this.http
      .get<any>(`${environment.apiUrl}account`, { headers: this.headers })
      .pipe(catchError(this.errorHandlingService.handleError));
  }
  getAllAccountsByRole(roleName: string): Observable<AccountInterface[]> {
    return this.http
      .get<any>(`${environment.apiUrl}account/by-role?roleName=${roleName}`, {
        headers: this.headers,
      })
      .pipe(catchError(this.errorHandlingService.handleError));
  }

  getAllRoles(): Observable<RoleInterface[]> {
    return this.http
      .get<any>(`${environment.apiUrl}role`, { headers: this.headers })
      .pipe(catchError(this.errorHandlingService.handleError));
  }
  deleteAccount(accountId: string): Observable<AccountInterface> {
    return this.http
      .delete<any>(`${environment.apiUrl}account/${accountId}`, {
        headers: this.headers,
      })
      .pipe(catchError(this.errorHandlingService.handleError));
  }
  addRoleToAccount(
    updateData: AddRoleToAccount,
    accountId: string
  ): Observable<AccountInterface> {
    return this.http
      .put<any>(
        `${environment.apiUrl}account/protected/add-role/${accountId}`,
        updateData,
        { headers: this.headers }
      )
      .pipe(catchError(this.errorHandlingService.handleError));
  }

  removeRoleToAccount(
    updateData: AddRoleToAccount,
    accountId: string
  ): Observable<AccountInterface> {
    return this.http
      .put<any>(
        `${environment.apiUrl}account/protected/delete-role/${accountId}`,
        updateData,
        { headers: this.headers }
      )
      .pipe(catchError(this.errorHandlingService.handleError));
  }

  activateAccount(accountId: string): Observable<AccountInterface> {
    return this.http
      .get<any>(
        `${environment.apiUrl}account/protected/activate-account/${accountId}`,
        { headers: this.headers }
      )
      .pipe(catchError(this.errorHandlingService.handleError));
  }

  deactivateAccount(accountId: string): Observable<AccountInterface> {
    return this.http
      .get<any>(
        `${environment.apiUrl}account/protected/deactivate-account/${accountId}`,
        { headers: this.headers }
      )
      .pipe(catchError(this.errorHandlingService.handleError));
  }

  // signup
  signupAdmin(signupData: SignupInterface): Observable<AccountInterface> {
    return this.http
      .post<any>(
        `${environment.apiUrl}account/protected/signup/admin`,
        signupData
      )
      .pipe(catchError(this.errorHandlingService.handleError));
  }

  // allergies
  getAllAllergies(): Observable<AllergyInterface[]> {
    return this.http
      .get<any>(`${environment.apiUrl}allergy`, { headers: this.headers })
      .pipe(catchError(this.errorHandlingService.handleError));
  }

  createAllergy(
    allergyData: CreateAllergyInterface
  ): Observable<AllergyInterface> {
    return this.http
      .post<any>(`${environment.apiUrl}allergy`, allergyData, {
        headers: this.headers,
      })
      .pipe(catchError(this.errorHandlingService.handleError));
  }

  editAllergy(
    allergyData: UpdateAllergyInterface,
    idAllergy: string
  ): Observable<AllergyInterface> {
    return this.http
      .put<any>(`${environment.apiUrl}allergy/${idAllergy}`, allergyData, {
        headers: this.headers,
      })
      .pipe(catchError(this.errorHandlingService.handleError));
  }
  deleteAllergy(idAllergy: string): Observable<AllergyInterface> {
    return this.http
      .delete<any>(`${environment.apiUrl}allergy/${idAllergy}`, {
        headers: this.headers,
      })
      .pipe(catchError(this.errorHandlingService.handleError));
  }

  // tracking values
  getAllTrackingValues(): Observable<TrackingValueInterface[]> {
    return this.http
      .get<any>(`${environment.apiUrl}tracking-value`, {
        headers: this.headers,
      })
      .pipe(catchError(this.errorHandlingService.handleError));
  }

  createTrackingValue(
    trackingValueData: CreateTrackingValueInterface
  ): Observable<TrackingValueInterface> {
    return this.http
      .post<any>(`${environment.apiUrl}tracking-value`, trackingValueData, {
        headers: this.headers,
      })
      .pipe(catchError(this.errorHandlingService.handleError));
  }

  editTrackingValue(
    trackingValueData: UpdateTrackingValueInterface,
    idTrackingValue: string
  ): Observable<TrackingValueInterface> {
    return this.http
      .put<any>(
        `${environment.apiUrl}tracking-value/${idTrackingValue}`,
        trackingValueData,
        { headers: this.headers }
      )
      .pipe(catchError(this.errorHandlingService.handleError));
  }

  deleteTrackingValue(
    idTrackingValue: string
  ): Observable<TrackingValueInterface> {
    return this.http
      .delete<any>(`${environment.apiUrl}tracking-value/${idTrackingValue}`, {
        headers: this.headers,
      })
      .pipe(catchError(this.errorHandlingService.handleError));
  }

  // medication
  getAllMedications(): Observable<MedicationInterface[]> {
    return this.http
      .get<any>(`${environment.apiUrl}medication`, { headers: this.headers })
      .pipe(catchError(this.errorHandlingService.handleError));
  }

  createMedication(
    medicationData: CreateMedicationInterface
  ): Observable<MedicationInterface> {
    return this.http
      .post<any>(`${environment.apiUrl}medication`, medicationData, {
        headers: this.headers,
      })
      .pipe(catchError(this.errorHandlingService.handleError));
  }

  deleteMedication(idMedication: string): Observable<MedicationInterface> {
    return this.http
      .delete<any>(`${environment.apiUrl}medication/${idMedication}`, {
        headers: this.headers,
      })
      .pipe(catchError(this.errorHandlingService.handleError));
  }

  editMedication(
    medicationData: UpdateMedicationInterface,
    idMedication: string
  ): Observable<MedicationInterface> {
    return this.http
      .put<any>(`${environment.apiUrl}medication/${idMedication}`, medicationData, {
        headers: this.headers,
      })
      .pipe(catchError(this.errorHandlingService.handleError));
  }
}
