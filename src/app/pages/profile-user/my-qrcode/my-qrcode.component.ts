import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { ProfileUserService } from '../profile-user.service';
import { Subscription } from 'rxjs';
import { SsrCookieService } from 'ngx-cookie-service-ssr';
import { Router } from '@angular/router';
import { AccountInterface } from '../../../shared/interfaces/account.interface';
import { SharedService } from '../../../shared/shared.service';
import { LoginService } from '../../login/login.service';
import { NgxScannerQrcodeComponent, ScannerQRCodeResult } from 'ngx-scanner-qrcode';
import { QrcodeService } from '../../qrcode/qrcode.service';

@Component({
  selector: 'app-my-qrcode',
  templateUrl: './my-qrcode.component.html',
  styleUrls: ['./my-qrcode.component.css']
})
export class MyQrcodeComponent implements OnInit {
  accountConnected: boolean = false;
  accountId?: string;
  account?: AccountInterface;
  private accountConnectedUsb?:Subscription;
  private accountUsb?:Subscription;
  private accountRoleUsb?:Subscription;
  token?:string;
  slug?:string;

  constructor(
    private profileUserService:ProfileUserService,
    private cookieService: SsrCookieService,
    private router: Router,
    private sharedService: SharedService,
    private loginService: LoginService,
    private qrCodeService: QrcodeService
    ) {}

    @ViewChild('action') action!: NgxScannerQrcodeComponent;

  ngOnInit(): void {
    this.accountConnectedUsb = this.loginService.account!.subscribe((account) => {
      this.accountConnected = !!account;
      if(this.accountConnected) {
        this.accountId = this.cookieService.get('account_id');
        this.accountUsb = this.sharedService.getAccountById(this.getAccountId()).subscribe((account) => {
          this.account = account;
          this.slug = account.slug;
          this.profileUserService.generateVerificationTokenAccount(account.accountId.toString()).subscribe((token) => {
            this.token = token.verificationToken;
          });
        });
      }
    });
  }


  public onEvent(e: ScannerQRCodeResult[], action?: any): void {
    if(this.action && this.action.isStart) {
      console.log('escaneando', this.action.data.value[0].value);
      this.qrCodeService.sendQrData({slug: this.slug!, token: this.token!, uniqueToken: this.action.data.value[0].value});
    }
  }

  getAccountId() {
    return this.cookieService.get('account_id');
  }
}
