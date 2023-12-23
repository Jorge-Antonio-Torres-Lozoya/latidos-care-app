import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable, catchError, tap } from 'rxjs';
import { environment } from '../../../environments/environment';
import { ErrorHandlingService } from '../../shared/error-handling.service';
import { AdminModel } from './admin.model';
import { AdminInterface } from '../../shared/interfaces/admin.interface';
import { LoginInterface } from '../../shared/interfaces/login.interface';
import { SsrCookieService } from 'ngx-cookie-service-ssr';

@Injectable({
  providedIn: 'root'
})
export class LoginAdminService {
  admin = new BehaviorSubject<any>(this.getStoredAdmin())
  adminIsConnected:boolean = false
  adminSesionId?:any;

  constructor(private http:HttpClient, private handleErrorService:ErrorHandlingService, private cookieService: SsrCookieService) { }

  private getStoredAdmin(): AdminModel | null {
    const adminToken = this.cookieService.get('admin-token');
    return adminToken ? new AdminModel(adminToken) : null;
  }

  loginAdmin(adminData:LoginInterface):Observable<AdminInterface> {
    return this.http.post<any>(`${environment.apiUrl}admin/login`, adminData).pipe(catchError(this.handleErrorService.handleError),
    tap(response => {
      this.adminSesionId = response.adminId
      this.adminIsConnected = true
      this.cookieService.set('admin-token', response.access_token);
      this.cookieService.set('admin_id', response.adminId.toString());
      const token =  this.cookieService.get('admin-token');
      const admin = new AdminModel(token)
      this.admin!.next(admin)
      this.cookieService.set('autoLoginAdmin', JSON.stringify(admin));
    }))
  }

  adminAutoLogin() {
    const adminToken = this.cookieService.get('admin-token');
    if(adminToken) {
      const adminData = adminToken;
      const admin = new AdminModel(adminData)
      if(admin.token) {
        this.admin!.next(admin)
      } else {
        return;
      }
    }
  }

  logoutAdmin() {
    this.cookieService.delete('admin-token');
    this.cookieService.delete('admin_id');
    this.cookieService.delete('autoLoginAdmin');
  }
}
