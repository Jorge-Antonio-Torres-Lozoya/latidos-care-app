import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TimeOutComponent } from './time-out.component';
import { RouterModule } from '@angular/router';



@NgModule({
  declarations: [
    TimeOutComponent
  ],
  imports: [
    CommonModule,
    RouterModule.forChild([{path: '', component: TimeOutComponent}]),
  ]
})
export class TimeOutModule { }
