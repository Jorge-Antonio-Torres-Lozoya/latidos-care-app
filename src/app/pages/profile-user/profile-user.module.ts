import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ProfileUserComponent } from './profile-user.component';
import { SharedModule } from '../../components/shared/shared.module';
import { RouterModule } from '@angular/router';
import { TrackingComponent } from './tracking/tracking.component';
import { EditComponent } from './edit/edit.component';
import { SicknessComponent } from './sickness/sickness.component';
import { SicknessDataComponent } from './sickness-data/sickness-data.component';
import { FormsModule } from '@angular/forms';
import { MedicationComponent } from './medication/medication.component';
import { AdvancedDataSicknessComponent } from './advanced-data-sickness/advanced-data-sickness.component';
import { NgxChartsModule } from '@swimlane/ngx-charts';
import { MyQrcodeComponent } from './my-qrcode/my-qrcode.component';
import { QRCodeModule } from 'angularx-qrcode';
import { TrackingValuesComponent } from './tracking-values/tracking-values.component';
import { AllergiesComponent } from './allergies/allergies.component';



@NgModule({
  declarations: [
    ProfileUserComponent,
    TrackingComponent,
    EditComponent,
    SicknessComponent,
    SicknessDataComponent,
    MedicationComponent,
    AdvancedDataSicknessComponent,
    MyQrcodeComponent,
    TrackingValuesComponent,
    AllergiesComponent,
  ],
  imports: [
    CommonModule,
    SharedModule,
    NgxChartsModule,
    QRCodeModule,
    RouterModule.forChild([{path: '', component:ProfileUserComponent, children: [
      {path: '', redirectTo: 'tracking-values', pathMatch:'full'},
      {path: 'tracking', component: TrackingComponent},
      {path: 'edit-profile', component: EditComponent},
      {path: 'sickness/:sicknessId', component: SicknessComponent},
      {path: 'sickness-data/:sicknessId', component: SicknessDataComponent},
      {path: 'medication/:sicknessId', component: MedicationComponent},
      {path: 'advanced-data-values', component: AdvancedDataSicknessComponent},
      {path: 'my-qr-code', component: MyQrcodeComponent},
      {path: 'tracking-values', component: TrackingValuesComponent},
      {path: 'allergies', component: AllergiesComponent}
    ]}]),
    FormsModule
  ]
})
export class ProfileUserModule { }
