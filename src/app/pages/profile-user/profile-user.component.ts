import { Component, OnDestroy, OnInit } from '@angular/core';
import { LoginUserService } from '../login-user/login-user.service';
import { Subscription } from 'rxjs';
import { Router } from '@angular/router';
import { NavItem } from '../../components/navbar/navbar.component';
import { SsrCookieService } from 'ngx-cookie-service-ssr';

@Component({
  selector: 'app-profile-user',
  templateUrl: './profile-user.component.html',
  styleUrls: ['./profile-user.component.css']
})
export class ProfileUserComponent implements OnInit, OnDestroy {
  logo = '../../../assets/images/logo-healthtech.svg';
  navItems?: NavItem[];
  userId?:string;
  logoutModal:string = 'none';
  userConnected:boolean = false;
  private userUsb?:Subscription;

  constructor(private userLoginService: LoginUserService, private router: Router, private cookieService: SsrCookieService) { }

  ngOnInit(): void {
    this.userId = this.cookieService.get('user_id')!
    this.userUsb = this.userLoginService.user!.subscribe((user) => {
      this.userConnected = !!user;
      this.navItems = [
        {
          content: 'Seguimiento',
          routerLink: `/profile-user/${this.userId}/tracking-values`,

        },
        {
          content: 'Enfermedades',
          routerLink: `/profile-user/${this.userId}/tracking`,

        },
        {
          content: 'Alergias',
          routerLink: `/profile-user/${this.userId}/allergies`,

        },
        {
          content: 'Perfil',
          routerLink: `/profile-user/${this.userId}/edit-profile`,

        },
        {
          content: 'Mi Código QR',
          routerLink: `/profile-user/${this.userId}/my-qr-code`,

        },
        {
          content: 'Cerrar Sessión',
          clickFunction: () => this.logoutDisplayModal()
        }
      ]
    })
  }

  logoutUser() {
    this.userLoginService.logoutUser();
    this.userLoginService.user!.next(null);
    this.router.navigate(['/login']);
  }

  logoutDisplayModal() {
    this.logoutModal = 'block';
  }

  logoutHideModal() {
    this.logoutModal = 'none';
  }

  ngOnDestroy(): void {
    this.userUsb!.unsubscribe();
  }

}
