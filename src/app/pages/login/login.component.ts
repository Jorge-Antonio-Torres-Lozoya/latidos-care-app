import { Component, OnDestroy, OnInit } from '@angular/core';
import { AccountInterface } from '../../shared/interfaces/account.interface';
import { Subscription } from 'rxjs';
import { LoginService } from './login.service';
import { SsrCookieService } from 'ngx-cookie-service-ssr';
import { Router } from '@angular/router';
import { NgForm } from '@angular/forms';
import { LoginInterface } from './interfaces/login.interface';
import { ForgotPasswordInterface } from '../recover-password-user/interfaces/forgot-password.interface';
import { SharedService } from '../../shared/shared.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit, OnDestroy {
  accountId?:string;
  error: string = '';
  displayError: boolean = false;
  showPassword: boolean = false;
  displayLoginModal:string = 'none';
  account?:AccountInterface
  accountConnected:boolean = false;
  private accountConnectedUsb?:Subscription;
  private accountUsb?:Subscription;

  //Recover Password
  displayPasswordModal:string = 'none';
  recoverPasswordError:string = '';
  displayRecoverPasswordError: boolean = false;
  displayRecoverPasswordConfirmation: string = 'none';

  constructor(
    private router: Router,
    private loginService: LoginService,
    private cookieService: SsrCookieService,
    private sharedService: SharedService
    ) { }

  ngOnInit(): void {
    this.accountConnectedUsb = this.loginService.account!.subscribe((account) => {
      this.accountConnected = !!account;
      if(this.accountConnected) {
        this.accountId = this.cookieService.get('account_id');
        this.accountUsb = this.sharedService.getAccountById(this.getAccountId()).subscribe((account) => {
          this.account = account;
        });
      }
    });
  }

  getAccountId() {
    return this.cookieService.get('account_id');
  }

  closeError() {
    this.displayError = false;
  }

  loginFun(form:NgForm) {
    if(!form.value){
      return
    }
    const loginData:LoginInterface = form.value
    this.loginService.login(loginData).subscribe(response => {
      this.displayLoginModal = 'block';
      this.account = response;
      if(response.registerData === true) {
        this.router.navigate([`/perfil-paciente`])
      } else if(response.registerData === false) {
        this.router.navigate([`/registro-informacion`])
      }
    }, errorMessage => {
      console.log(errorMessage)
      this.displayError = true;
      this.error = errorMessage
    })
    form.reset()
  }

  passwordFun() {
    this.showPassword = !this.showPassword;
  }

  closeModal() {
    this.displayLoginModal = 'none';
  }

  recoverFun(form:NgForm) {
    const formData:ForgotPasswordInterface = form.value;
    this.loginService.forgotPassword(formData).subscribe(response => {
      this.displayPasswordModal = 'none';
      this.displayRecoverPasswordConfirmation = 'block'
    }, errorMessage => {
      console.log(errorMessage)
      this.recoverPasswordError = errorMessage
      this.displayRecoverPasswordError = true;
    })
  }

  closeRecoverPasswordError() {
    this.displayRecoverPasswordError = false;
  }

  closeRecoverPasswordConfirmation() {
    this.displayRecoverPasswordConfirmation = 'none'
  }

  closePasswordModal() {
    this.displayPasswordModal = 'none';
  }

  openRecoverPassword() {
    this.displayPasswordModal = 'block';
  }

  ngOnDestroy(): void {
    if(this.accountUsb) {
      this.accountUsb.unsubscribe();
    }

    if(this.accountConnectedUsb) {
      this.accountConnectedUsb.unsubscribe();
    }
  }
}
