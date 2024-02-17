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
import { QrDataInterface } from '../../../shared/interfaces/qrData.interface';
import { CreateConsentInterface } from '../interfaces/create-consent-interface';

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
  displayConsentModal:string = 'none';
  displayAcceptModal:string = 'none';
  displayRejectModal:string = 'none';
  qrData?: QrDataInterface;

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
      this.qrData  = {slug: this.slug!, token: this.token!, uniqueToken: this.action.data.value[0].value}
      this.displayConsentModal = 'block'
    }
  }

  giveConsent() {
    const consentData: CreateConsentInterface = {accountId: parseInt(this.getAccountId()), consent: true}
    this.qrData!.consent = true;
    this.profileUserService.createConsent(consentData).subscribe(consent => {
      this.qrCodeService.sendQrData({slug: this.slug!, token: this.token!, uniqueToken: this.action.data.value[0].value, consent: true});
      this.displayConsentModal = 'none';
      this.displayAcceptModal = 'block';
    })
  }

  rejectConsent() {
    const consentData: CreateConsentInterface = {accountId: parseInt(this.getAccountId()), consent: false}
    this.qrData!.consent = false;
    this.profileUserService.createConsent(consentData).subscribe(consent => {
      this.qrCodeService.sendQrData({slug: this.slug!, token: this.token!, uniqueToken: this.action.data.value[0].value, consent: false});
      this.displayConsentModal = 'none';
      this.displayAcceptModal = 'none';
      this.displayRejectModal = 'block';
    })
  }


  closeRejectModal() {
    this.displayRejectModal = 'none';
  }

  closeAcceptModal() {
    this.displayAcceptModal = 'none';
  }

  getAccountId() {
    return this.cookieService.get('account_id');
  }
}
