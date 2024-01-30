import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ProfileAdminComponent } from './profile-admin.component';
import { SharedModule } from '../../components/shared/shared.module';
import { RouterModule } from '@angular/router';
import { SicknessDashboardComponent } from './sickness-dashboard/sickness-dashboard.component';
import { DashboardAllergiesComponent } from './dashboard-allergies/dashboard-allergies.component';
import { DashboardTrackingValuesComponent } from './dashboard-tracking-values/dashboard-tracking-values.component';
import { DashboardAccountsComponent } from './dashboard-accounts/dashboard-accounts.component';
import { RegisterAdminComponent } from './register-admin/register-admin.component';



@NgModule({
  declarations: [
    ProfileAdminComponent,
    SicknessDashboardComponent,
    DashboardAllergiesComponent,
    DashboardTrackingValuesComponent,
    DashboardAccountsComponent,
    RegisterAdminComponent,

  ],
  imports: [
    CommonModule,
    SharedModule,
    RouterModule.forChild([{path: '', component: ProfileAdminComponent, children: [
      {path: '', redirectTo: 'panel-cuentas', pathMatch:'full'},
      {path: 'panel-cuentas', component: DashboardAccountsComponent},
      {path: 'registro-administrador', component: RegisterAdminComponent},
      {path: 'panel-valores-laboratorio', component: DashboardTrackingValuesComponent},
      {path: 'panel-enfermedades', component: SicknessDashboardComponent},
      {path: 'panel-alergias', component: DashboardAllergiesComponent},
    ]}])
  ]
})
export class ProfileAdminModule { }
