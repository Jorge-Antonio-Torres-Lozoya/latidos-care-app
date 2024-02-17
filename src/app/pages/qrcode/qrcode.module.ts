import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { QrcodeComponent } from './qrcode.component';
import { QRCodeModule } from 'angularx-qrcode';
import { SharedModule } from '../../components/shared/shared.module';
import { RouterModule } from '@angular/router';



@NgModule({
  declarations: [
    QrcodeComponent
  ],
  imports: [
    CommonModule,
    QRCodeModule,
    SharedModule,
    RouterModule.forChild([{path: '', component: QrcodeComponent}]),
  ]
})
export class QrcodeModule { }
