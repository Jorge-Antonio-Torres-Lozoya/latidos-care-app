import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Router } from '@angular/router';
import { LoginAdminService } from './login-admin.service';
import { LoginInterface } from '../../shared/interfaces/login.interface';

@Component({
  selector: 'app-login-admin',
  templateUrl: './login-admin.component.html',
  styleUrls: ['./login-admin.component.css']
})
export class LoginAdminComponent implements OnInit {
  logo = '../../../assets/images/logo-color-svg.svg';
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

  errorMsg?: string = undefined;
  passwordVisible: { value: boolean } = { value: false };

  myHandleErrorFunction() {
    this.errorMsg = undefined
  }

  myLoginFunction(form:NgForm) {
    if(!form.value){
      return
    }
    const loginData:LoginInterface = form.value
    this.adminLoginService.loginAdmin(loginData).subscribe(response => {
      this.router.navigate([`/protected/profile-admin/${response.adminId.toString()}`])
    }, errorMessage => {
      console.log(errorMessage)
      this.errorMsg = errorMessage
    })
    form.reset()
  }

  myPasswordFunction() {
    this.passwordVisible.value = !this.passwordVisible.value;
  }


  constructor(private router: Router, private adminLoginService: LoginAdminService) { }

  ngOnInit(): void {
  }

  forceNavigate(name: string) {
    this.router.navigate(['/'], { fragment: name });
  }

}
