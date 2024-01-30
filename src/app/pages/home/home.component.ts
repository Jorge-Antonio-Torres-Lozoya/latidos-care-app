import { Component, OnDestroy, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { SsrCookieService } from 'ngx-cookie-service-ssr';
import { LoginService } from '../login/login.service';
import { AccountInterface } from '../../shared/interfaces/account.interface';
import { SharedService } from '../../shared/shared.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit, OnDestroy {
  accountId?:string;
  account?:AccountInterface
  accountConnected:boolean = false;
  private accountConnectedUsb?:Subscription;
  private accountUsb?:Subscription;

  constructor(
    private router: Router,
    private cookieService: SsrCookieService,
    private loginService: LoginService,
    private sharedService: SharedService
    ) { }

  ngOnInit(): void {
    this.accountConnectedUsb = this.loginService.account!.subscribe((account) => {
      this.accountConnected = !!account;
      if(this.accountConnected) {
        this.accountId = this.cookieService.get('account_id');
        this.accountUsb = this.sharedService.getAccountById(this.getAccountId()).subscribe((account) => {
          this.account = account;
          this.router.navigateByUrl(`perfil-paciente`)
        });
      }
    });
  }

  getAccountId() {
    return this.cookieService.get('account_id');
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
