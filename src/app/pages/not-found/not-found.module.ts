import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NotFoundComponent } from './not-found.component';
import { RouterModule } from '@angular/router';
import { SharedModule } from '../../components/shared/shared.module';



@NgModule({
  declarations: [
    NotFoundComponent
  ],
  imports: [
    CommonModule,
    SharedModule,
    RouterModule.forChild([{path: '', component: NotFoundComponent}]),
  ]
})
export class NotFoundModule { }
