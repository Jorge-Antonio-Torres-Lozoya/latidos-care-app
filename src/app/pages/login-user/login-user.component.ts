import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Router } from '@angular/router';
import { LoginInterface } from '../../shared/interfaces/login.interface';
import { LoginUserService } from './login-user.service';
import { ForgotPasswordInterface } from '../../shared/interfaces/forgot-password.interface';

@Component({
  selector: 'app-login-user',
  templateUrl: './login-user.component.html',
  styleUrls: ['./login-user.component.css']
})
export class LoginUserComponent implements OnInit {
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
    this.userLoginService.loginUser(loginData).subscribe(response => {
      if(response.registerData === false) {
        this.router.navigate([`/register-data/${response.userId.toString()}`])
      } else {
        this.router.navigate([`/profile-user/${response.userId.toString()}`])
      }
    }, errorMessage => {
      console.log(errorMessage)
      this.errorMsg = errorMessage
    })
    form.reset()
  }

  myPasswordFunction() {
    this.passwordVisible.value = !this.passwordVisible.value;
  }

  displayRecoverModal: string = 'none';

  showRecoverPassword() {
    console.log(this.displayRecoverModal);
    this.displayRecoverModal = 'block'
  }

  handlePasswordModal() {
    this.displayRecoverModal = 'none'
  }

  myErrorRecover?: string = undefined;

  myHandleErrorRecoverFunction() {
    this.myErrorRecover = undefined
  }

  myDisplayRecoverPasswordConfirmation: string = 'none';

  myCloseRecoverPasswordConfirmation() {
    this.myDisplayRecoverPasswordConfirmation = 'none'
  }

  myRecoverFunction(form:NgForm) {
    const formData:ForgotPasswordInterface = form.value;
    this.userLoginService.forgotPassword(formData).subscribe(response => {
      this.displayRecoverModal = 'none';
      this.myDisplayRecoverPasswordConfirmation = 'block'
    }, errorMessage => {
      console.log(errorMessage)
      this.myErrorRecover = errorMessage
    })

  }

  constructor(private router: Router, private userLoginService: LoginUserService) { }

  ngOnInit(): void {
  }

  forceNavigate(name: string) {
    this.router.navigate(['/'], { fragment: name });
  }

}
