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
  displayRejectModal:string = 'none';

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
        if(qrData.consent! === true) {
          this.router.navigateByUrl(`paciente/${qrData.slug}?token=${qrData.token}`);
        } else if(qrData.consent! === false) {
          this.displayRejectModal = 'block';
        }
      }
    })

  }

  closeRejectModal() {
    this.displayRejectModal = 'none';
  }

}
