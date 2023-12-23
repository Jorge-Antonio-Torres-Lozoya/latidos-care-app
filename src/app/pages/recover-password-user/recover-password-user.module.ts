import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RecoverPasswordUserComponent } from './recover-password-user.component';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';



@NgModule({
  declarations: [
    RecoverPasswordUserComponent
  ],
  imports: [
    CommonModule,
    FormsModule,
    RouterModule.forChild([{path: '', component: RecoverPasswordUserComponent}]),
  ]
})
export class RecoverPasswordUserModule { }
