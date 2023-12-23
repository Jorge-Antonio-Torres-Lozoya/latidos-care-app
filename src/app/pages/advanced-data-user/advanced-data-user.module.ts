import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AdvancedDataUserComponent } from './advanced-data-user.component';
import { NgxChartsModule } from '@swimlane/ngx-charts';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';



@NgModule({
  declarations: [
    AdvancedDataUserComponent
  ],
  imports: [
    CommonModule,
    NgxChartsModule,
    FormsModule,
    RouterModule.forChild([{path: '', component: AdvancedDataUserComponent}]),
  ]
})
export class AdvancedDataUserModule { }
