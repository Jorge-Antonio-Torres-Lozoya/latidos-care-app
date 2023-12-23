import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ConfirmTreatmentComponent } from './confirm-treatment.component';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';



@NgModule({
  declarations: [
    ConfirmTreatmentComponent
  ],
  imports: [
    CommonModule,
    FormsModule,
    RouterModule.forChild([{path: '', component: ConfirmTreatmentComponent}])
  ]
})
export class ConfirmTreatmentModule { }
