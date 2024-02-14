import { Component, OnDestroy, OnInit } from '@angular/core';
import { ProfileUserService } from '../profile-user.service';
import { SsrCookieService } from 'ngx-cookie-service-ssr';
import { AccountInterface } from '../../../shared/interfaces/account.interface';
import { Subscription } from 'rxjs';
import { LoginService } from '../../login/login.service';
import { SharedService } from '../../../shared/shared.service';
import { WindowService } from '../../../shared/window.service';
import { NgForm } from '@angular/forms';
import { UpdateAccountInterface } from '../../../shared/interfaces/update-account.interface';
import { ChangePasswordInterface } from '../interfaces/change-password.interface';

@Component({
  selector: 'app-edit',
  templateUrl: './edit.component.html',
  styleUrls: ['./edit.component.css']
})
export class EditComponent implements OnInit, OnDestroy {
  accountConnected: boolean = false;
  accountId?: string;
  account?: AccountInterface;
  private accountConnectedUsb?:Subscription;
  private accountUsb?:Subscription;
  errorCreate:string = '';
  displayErrorCreate: boolean = false;
  displayConfirmCreate: boolean = false;

  showPassword: boolean = false;
  newShowPassword: boolean = false;
  errorPassword:string = '';
  displayErrorPassword: boolean = false;
  displayConfirmPassword: boolean = false;

  isMobile: boolean = false;
  private windowSub?: Subscription;

  constructor(
    private profileUserService: ProfileUserService,
    private cookieService: SsrCookieService,
    private loginService: LoginService,
    private sharedService: SharedService,
    private windowService: WindowService
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

    this.windowSub = this.windowService.isMobile$.subscribe((isMobile) => {
      this.isMobile = isMobile;
    });

  }

  getAccountId() {
    return this.cookieService.get('account_id');
  }

  editAccount(form:NgForm) {
    const accountData: UpdateAccountInterface = form.value;

    this.sharedService.updateAccount(this.getAccountId(), accountData).subscribe(account => {
      this.account = account;
      this.displayConfirmCreate = true;
    },
    (errorMessage) => {
      console.log(errorMessage);
      this.errorCreate = errorMessage;
      this.displayErrorCreate = true;
    });
  }

  changePassword(form:NgForm) {
    const accountData: ChangePasswordInterface = form.value;

    this.profileUserService.changePassword(this.getAccountId(), accountData).subscribe(account => {
      this.account = account;
      this.displayConfirmPassword = true;
    },
    (errorMessage) => {
      console.log(errorMessage);
      this.errorPassword = errorMessage;
      this.displayErrorPassword = true;
    });
    form.reset();
  }

  closeConfirmCreate() {
    this.displayConfirmCreate = false;
  }

  closeErrorCreate() {
    this.displayErrorCreate = false;
  }

  closeConfirmPassword() {
    this.displayConfirmPassword = false;
  }

  closeErrorPassword() {
    this.displayErrorPassword = false;
  }

  passwordFun() {
    this.showPassword = !this.showPassword;
  }

  newPasswordFun() {
    this.newShowPassword = !this.newShowPassword;
  }

  ngOnDestroy(): void {
    if(this.accountConnectedUsb) {
      this.accountConnectedUsb.unsubscribe();
    }

    if(this.accountUsb) {
      this.accountUsb.unsubscribe();
    }
  }

}
