import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RegisterDataComponent } from './register-data.component';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';



@NgModule({
  declarations: [
    RegisterDataComponent
  ],
  imports: [
    CommonModule,
    FormsModule,
    RouterModule.forChild([{path: '', component: RegisterDataComponent}]),
  ]
})
export class RegisterDataModule { }
