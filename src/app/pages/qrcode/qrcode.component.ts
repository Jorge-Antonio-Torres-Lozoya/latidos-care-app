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
  //qrObservable?: Observable<QrDataInterface>;
  qrSubscription?: Subscription;

  constructor(
    private router: Router,
    private qrCodeService: QrcodeService
    ) {
      //this.qrObservable = this.qrCodeService.getQrData();
    }

  ngOnInit(): void {
    /*this.qrSubscription = this.qrObservable?.subscribe(qrData => {
      if(qrData) {
        const redirectUrl = `http://localhost:4200/paciente/${qrData.slug}?token=${qrData.token}`
        window.location.href = redirectUrl;
      }
    })*/
    this.qrSubscription = this.qrCodeService.qrSubject.subscribe(qrData => {
      if(qrData) {
        const redirectUrl = `http://localhost:4200/paciente/${qrData.slug}?token=${qrData.token}`
        window.location.href = redirectUrl;
      }
    })
  }

  toAdvancedData() {
    this.router.navigateByUrl(`paciente/${this.slug}?token=${this.token}`)
  }
}
