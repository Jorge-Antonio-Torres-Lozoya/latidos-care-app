import { NgModule } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { ProfileUserComponent } from './profile-user.component';
import { SharedModule } from '../../components/shared/shared.module';
import { RouterModule } from '@angular/router';
import { TrackingComponent } from './sicknesses/tracking.component';
import { EditComponent } from './edit/edit.component';
import { SicknessDataComponent } from './sickness-data/sickness-data.component';
import { FormsModule } from '@angular/forms';
import { AdvancedDataSicknessComponent } from './advanced-data-sickness/advanced-data-sickness.component';
import { NgxChartsModule } from '@swimlane/ngx-charts';
import { MyQrcodeComponent } from './my-qrcode/my-qrcode.component';
import { QRCodeModule } from 'angularx-qrcode';
import { TrackingValuesComponent } from './tracking-values/tracking-values.component';
import { AllergiesComponent } from './allergies/allergies.component';
import { LOCALE_ID } from '@angular/core';
import { registerLocaleData } from '@angular/common';
import localeEs from '@angular/common/locales/es';
import { LOAD_WASM, NgxScannerQrcodeModule } from 'ngx-scanner-qrcode';
registerLocaleData(localeEs);
//LOAD_WASM().subscribe();

@NgModule({
  declarations: [
    ProfileUserComponent,
    TrackingComponent,
    EditComponent,
    SicknessDataComponent,
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
    NgxScannerQrcodeModule,
    RouterModule.forChild([{path: '', component:ProfileUserComponent, children: [
      {path: '', redirectTo: 'valores-laboratorio', pathMatch:'full'},
      {path: 'enfermedades', component: TrackingComponent},
      {path: 'ajustes', component: EditComponent},
      {path: 'informacion-enfermedad/:enfermedadSlug', component: SicknessDataComponent},
      {path: 'datos-avanzados', component: AdvancedDataSicknessComponent},
      {path: 'mi-qr', component: MyQrcodeComponent},
      {path: 'valores-laboratorio', component: TrackingValuesComponent},
      {path: 'alergias', component: AllergiesComponent}
    ]}]),
    FormsModule
  ],
  providers: [{ provide: LOCALE_ID, useValue: 'es' }]
})
export class ProfileUserModule { }
