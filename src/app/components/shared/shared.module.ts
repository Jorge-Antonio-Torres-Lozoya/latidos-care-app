import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NavbarComponent } from '../navbar/navbar.component';
import { RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { LoginFormComponent } from '../forms/login-form/login-form.component';
import { SignupFormComponent } from '../forms/signup-form/signup-form.component';
import { ProfileEditComponent } from '../profile/profile-edit/profile-edit.component';
import { SicknessFormComponent } from '../forms/sickness-form/sickness-form.component';

@NgModule({
  declarations: [
    NavbarComponent,
    LoginFormComponent,
    SignupFormComponent,
    ProfileEditComponent,
    SicknessFormComponent,
  ],
  exports: [
    NavbarComponent,
    LoginFormComponent,
    SignupFormComponent,
    ProfileEditComponent,
    SicknessFormComponent,
  ],
  imports: [CommonModule, RouterModule, FormsModule],
})
export class SharedModule {}
