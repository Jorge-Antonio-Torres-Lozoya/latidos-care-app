import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Observable, Subscription } from 'rxjs';
import { QrDataInterface } from '../../shared/interfaces/qrData.interface';
import { QrcodeService } from './qrcode.service';

@Component({
  selector: 'app-qrcode',
  templateUrl: './qrcode.component.html',
  styleUrls: ['./qrcode.component.css']
})
export class QrcodeComponent implements OnInit {
  token?:string;
  slug?: string;
  qrObservable?: Observable<QrDataInterface>;
  qrSubscription?: Subscription;
  uniqueToken?:string;

  constructor(
    private router: Router,
    private qrCodeService: QrcodeService
    ) {
      this.qrObservable = this.qrCodeService.getQrData();
    }

  ngOnInit(): void {
    this.uniqueToken = Math.floor(
      100000 + Math.random() * 900000,
    ).toString();
    this.qrSubscription = this.qrObservable?.subscribe(qrData => {
      if(qrData && qrData.uniqueToken === this.uniqueToken) {
        const redirectUrl = `http://localhost:4200/paciente/${qrData.slug}?token=${qrData.token}`
        console.log(redirectUrl);
        this.router.navigateByUrl(`paciente/${qrData.slug}?token=${qrData.token}`);
      }
    })
    /*this.qrSubscription = this.qrCodeService.qrSubject.subscribe({
      next: (qrData) => {
        if (qrData !== null) {
          const redirectUrl = `https://latidos-care-app-production.up.railway.app/paciente/${qrData.slug}?token=${qrData.token}`;
          console.log(redirectUrl);
          this.router.navigateByUrl(`paciente/${qrData.slug}?token=${qrData.token}`);
        }
      },
      error: (err) => console.error('Error in QR subscription', err),
    });*/

  }

  toAdvancedData() {
    this.router.navigateByUrl(`paciente/${this.slug}?token=${this.token}`)
  }
}
