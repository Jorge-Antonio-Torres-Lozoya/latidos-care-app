import { Component, OnDestroy, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { LoginAdminService } from '../login-admin/login-admin.service';
import { NavItem } from '../../components/navbar/navbar.component';
import { SsrCookieService } from 'ngx-cookie-service-ssr';

@Component({
  selector: 'app-profile-admin',
  templateUrl: './profile-admin.component.html',
  styleUrls: ['./profile-admin.component.css']
})
export class ProfileAdminComponent implements OnInit, OnDestroy {
  logo = '../../../assets/images/logo-color-svg.svg';
  navItems?: NavItem[];
  logoutModal:string = 'none';
  adminId?:string;
  adminConnected:boolean = false;
  private adminUsb?:Subscription;

  constructor(private adminLoginService: LoginAdminService, private router: Router, private cookieService: SsrCookieService) { }

  ngOnInit(): void {
    this.adminId = this.cookieService.get('admin_id')!
    this.adminUsb = this.adminLoginService.admin!.subscribe((admin) => {
      this.adminConnected = !!admin;
      this.navItems = [
        {
          content: 'Dashboard Enfermedades',
          routerLink: `/protected/profile-admin/${this.adminId}/dashboard-sickness`,

        },
        {
          content: 'Crear Enfermedad',
          routerLink: `/protected/profile-admin/${this.adminId}/create-sickness`,

        },
        {
          content: 'Perfil',
          routerLink: `/protected/profile-admin/${this.adminId}/edit-profile`,

        },
        {
          content: 'Cerrar Sessión',
          clickFunction: () => this.logoutDisplayModal()
        }
      ];
    })
  }

  logoutAdmin() {
    this.adminLoginService.logoutAdmin();
    this.adminLoginService.admin!.next(null);
    this.router.navigate(['/protected/login-admin']);
  }

  logoutDisplayModal() {
    this.logoutModal = 'block';
  }

  logoutHideModal() {
    this.logoutModal = 'none';
  }

  ngOnDestroy(): void {
    this.adminUsb!.unsubscribe();
  }

}
