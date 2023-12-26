import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';
import { HomeComponent } from './pages/home/home.component';
import { TermsConditionsComponent } from './pages/terms-conditions/terms-conditions.component';
import { LibroReclamacionesComponent } from './pages/libro-reclamaciones/libro-reclamaciones.component';
import { QrAccessGuard } from './shared/guards/advanced-data.guard';
import { AdminGuard } from './shared/guards/admin.guard';
import { UserGuard } from './shared/guards/user.guard';
import { RecoverPasswordGuard } from './shared/guards/recover-password.guard';

const routes: Routes = [
  {path: '', component: HomeComponent},
  {path: 'pacient/:userId', canActivate: [QrAccessGuard],
  loadChildren:() => import('./pages/data-pacient/data-pacient.module').then(m => m.DataPacientModule)},
  {path: 'register-user',
  loadChildren:() => import('./pages/register-user/register-user.module').then(m => m.RegisterUserModule) },
  {path: 'protected/login-admin',
  loadChildren:() => import('./pages/login-admin/login-admin.module').then(m => m.LoginAdminModule) },
  {path: 'login',
  loadChildren:() => import('./pages/login-user/login-user.module').then(m => m.LoginUserModule) },
  {path: 'verification', loadChildren:() => import('./pages/verification-user/verification-user.module').then(m => m.VerificationUserModule)},
  {path: 'recover-password-user/:id', canActivate: [RecoverPasswordGuard], loadChildren:() => import('./pages/recover-password-user/recover-password-user.module').then(m => m.RecoverPasswordUserModule)},
  {path: 'register-data/:id', canActivate: [UserGuard],
  loadChildren:() => import('./pages/register-data/register-data.module').then(m => m.RegisterDataModule) },
  {path: 'protected/profile-admin/:id', canActivate: [AdminGuard],
  loadChildren:() => import('./pages/profile-admin/profile-admin.module').then(m => m.ProfileAdminModule) },
  {path: 'profile-user/:id', canActivate: [UserGuard],
  loadChildren:() => import('./pages/profile-user/profile-user.module').then(m => m.ProfileUserModule) },
  {path: 'libro-reclamaciones',
  component: LibroReclamacionesComponent },
  {path: 'terms-conditions',
  component: TermsConditionsComponent },
  {path: 'forgot-password',
  loadChildren:() => import('./pages/forgot-password/forgot-password.module').then(m => m.ForgotPasswordModule) },
  {path: 'user/:userId/confirm-treatment/:medicationId',
  loadChildren:() => import('./pages/confirm-treatment/confirm-treatment.module').then(m => m.ConfirmTreatmentModule)},
  /*{path: 'medic/:userId/advanced-data', canActivate: [QrAccessGuard],
  loadChildren:() => import('./pages/advanced-data-user/advanced-data-user.module').then(m => m.AdvancedDataUserModule)},*/
  {path: 'unauthorized',
  loadChildren:() => import('./pages/unauthorized/unauthorized.module').then(m => m.UnauthorizedModule)},
  {path: 'time-out',
  loadChildren:() => import('./pages/time-out/time-out.module').then(m => m.TimeOutModule)},
  { path: '**',
  loadChildren:() => import('./pages/not-found/not-found.module').then(m => m.NotFoundModule) }
];

@NgModule({
  imports: [RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules, initialNavigation: 'enabledBlocking', scrollPositionRestoration: 'enabled' })],
  exports: [RouterModule]
})
export class AppRoutingModule { }
