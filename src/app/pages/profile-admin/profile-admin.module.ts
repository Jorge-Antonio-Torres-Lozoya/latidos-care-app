import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ProfileAdminComponent } from './profile-admin.component';
import { SharedModule } from '../../components/shared/shared.module';
import { RouterModule } from '@angular/router';
import { EditAdminComponent } from './edit-admin/edit-admin.component';
import { CreateSicknessComponent } from './create-sickness/create-sickness.component';
import { EditSicknessComponent } from './edit-sickness/edit-sickness.component';
import { SicknessDashboardComponent } from './sickness-dashboard/sickness-dashboard.component';
import { SicknessComponent } from '../profile-user/sickness/sickness.component';
import { SicknessFormComponent } from '../../components/forms/sickness-form/sickness-form.component';



@NgModule({
  declarations: [
    ProfileAdminComponent,
    EditAdminComponent,
    CreateSicknessComponent,
    EditSicknessComponent,
    SicknessDashboardComponent,

  ],
  imports: [
    CommonModule,
    SharedModule,
    RouterModule.forChild([{path: '', component: ProfileAdminComponent, children: [
      {path: '', redirectTo: 'dashboard-sickness', pathMatch:'full'},
      {path: 'edit-profile', component: EditAdminComponent},
      {path: 'create-sickness', component: CreateSicknessComponent},
      {path: 'edit-sickness/:sicknessId', component: EditSicknessComponent},
      {path: 'dashboard-sickness', component: SicknessDashboardComponent},
    ]}])
  ]
})
export class ProfileAdminModule { }
