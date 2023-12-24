import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Router } from '@angular/router';
import { SignupUserInterface } from './signup-user.interface';
import { SignupUserService } from './register-user.service';

@Component({
  selector: 'app-register-user',
  templateUrl: './register-user.component.html',
  styleUrls: ['./register-user.component.css']
})
export class RegisterUserComponent implements OnInit {
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

  mySignupFunction(form:NgForm) {
    if(!form.value){
      return
    }
    const signupData: SignupUserInterface = form.value;
    this.userSignupService.signupUser(signupData).subscribe(response => {
      this.router.navigate(['/login'])
    }, errorMessage => {
      console.log(errorMessage)
      this.errorMsg = errorMessage;
    })
    form.reset()
  }

  myPasswordFunction() {
    this.passwordVisible.value = !this.passwordVisible.value;
  }

  constructor(
    private userSignupService: SignupUserService,
    private router: Router
    ) { }

  ngOnInit(): void {
  }

  forceNavigate(name: string) {
    this.router.navigate(['/'], { fragment: name });
  }

}
