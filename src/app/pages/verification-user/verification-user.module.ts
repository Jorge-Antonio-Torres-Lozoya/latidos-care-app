import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { VerificationUserComponent } from './verification-user.component';
import { RouterModule } from '@angular/router';



@NgModule({
  declarations: [
    VerificationUserComponent
  ],
  imports: [
    CommonModule,
    RouterModule.forChild([{path: '', component: VerificationUserComponent}]),
  ]
})
export class VerificationUserModule { }
