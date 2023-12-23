import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { LoginUserService } from '../login-user/login-user.service';
import { LoginAdminService } from '../login-admin/login-admin.service';
import { SsrCookieService } from 'ngx-cookie-service-ssr';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {
  logo = '../../../assets/images/logo-healthtech.svg';
  navItems = [
    {
      content: 'Nosotros',
      routerLink: `/#about`,
      clickFunction: () => this.forceNavigate('about')
    },
    {
      content: 'Nuestro Servicios',
      routerLink: `/#services`,
      clickFunction: () => this.forceNavigate('services')
    },
    {
      content: 'Preguntas frecuentes',
      routerLink: '/#frequent-questions',
      clickFunction: () => this.forceNavigate('frequent-questions')
    },
    {
      content: 'Iniciar Sesion',
      routerLink: '/login',
    },
    {
      content: 'Registrarme',
      routerLink: '/register-user',
    }
  ];
  userId:string = this.cookieService.get('user_id')
  adminId:string = this.cookieService.get('admin_id')
  userUsb?: Subscription;
  adminUsb?: Subscription;

  constructor(
    private router: Router,
    private loginUserService: LoginUserService,
    private loginAdminService: LoginAdminService,
    private cookieService: SsrCookieService
    ) { }

  ngOnInit(): void {
    this.userUsb = this.loginUserService.user?.subscribe(user => {
      const isAuthenticated:boolean = !!user;
      console.log(isAuthenticated);
      if(isAuthenticated) {
        this.router.navigateByUrl(`profile-user/${this.userId}`)
      }
    })
    this.adminUsb = this.loginAdminService.admin?.subscribe(admin => {
      const isAuthenticated:boolean = !!admin;
      console.log(isAuthenticated);
      if(isAuthenticated) {
        this.router.navigateByUrl(`protected/profile-admin/${this.adminId}`)
      }
    })
  }

  forceNavigate(name: string) {
    this.router.navigate(['/'], { fragment: name });
  }

}
