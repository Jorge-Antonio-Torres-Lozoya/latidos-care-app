import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DataPacientComponent } from './data-pacient.component';
import { NgxChartsModule } from '@swimlane/ngx-charts';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';



@NgModule({
  declarations: [
    DataPacientComponent
  ],
  imports: [
    CommonModule,
    NgxChartsModule,
    FormsModule,
    RouterModule.forChild([{path: '', component: DataPacientComponent}]),
  ]
})
export class DataPacientModule { }
