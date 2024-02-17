import { isPlatformBrowser } from '@angular/common';
import { Inject, Injectable, PLATFORM_ID } from '@angular/core';
import { Socket } from 'ngx-socket-io';
import { QrDataInterface } from '../../shared/interfaces/qrData.interface';
import { BehaviorSubject, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class QrcodeService {
  private isBrowser?: boolean;
  public qrSubject = new BehaviorSubject<QrDataInterface | null>(null);

  constructor(
    private socket: Socket,
    @Inject(PLATFORM_ID) private platformId: Object
  ) {
    this.isBrowser = isPlatformBrowser(this.platformId);
  }

  sendQrData(qrData: QrDataInterface):void {
    this.qrSubject.next(qrData)
    /*if (this.isBrowser) {
      this.socket.emit('sendQrData', qrData);
    }*/
  }

  /*getQrData(): Observable<QrDataInterface> {
    return this.isBrowser ? this.socket.fromEvent('sendQrData') : new Observable();
  }*/
}
