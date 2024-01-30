import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { HomeComponent } from './pages/home/home.component';
import { FooterComponent } from './pages/footer/footer.component';
import { TermsConditionsComponent } from './pages/terms-conditions/terms-conditions.component';
import { LibroReclamacionesComponent } from './pages/libro-reclamaciones/libro-reclamaciones.component';
import { ServiceComponent } from './pages/home/service/service.component';
import { AboutComponent } from './pages/home/about/about.component';
import { FrequentQuestionsComponent } from './pages/home/frequent-questions/frequent-questions.component';
import { ViewportScroller } from '@angular/common';
import { Router, Scroll } from '@angular/router';
import { filter } from 'rxjs/operators';
import { RegisterUserModule } from './pages/register-user/register-user.module';
import { SharedModule } from './components/shared/shared.module';
import { ProfileAdminModule } from './pages/profile-admin/profile-admin.module';
import { ProfileUserModule } from './pages/profile-user/profile-user.module';
import { ForgotPasswordModule } from './pages/forgot-password/forgot-password.module';
import { HttpClientModule } from '@angular/common/http';
import { NgxChartsModule } from '@swimlane/ngx-charts';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { QRCodeModule } from 'angularx-qrcode';
import { UnauthorizedModule } from './pages/unauthorized/unauthorized.module';
import { AdvancedDataUserModule } from './pages/advanced-data-user/advanced-data-user.module';
import { NotFoundModule } from './pages/not-found/not-found.module';
import { TimeOutModule } from './pages/time-out/time-out.module';
import { LoginModule } from './pages/login/login.module';


@NgModule({
  declarations: [
    AppComponent,
    HomeComponent,
    FooterComponent,
    LibroReclamacionesComponent,
    TermsConditionsComponent,
    ServiceComponent,
    AboutComponent,
    FrequentQuestionsComponent,
  ],
  imports: [
    BrowserModule,
    HttpClientModule,
    AppRoutingModule,
    RegisterUserModule,
    SharedModule,
    ProfileAdminModule,
    ProfileUserModule,
    ForgotPasswordModule,
    NgxChartsModule,
    BrowserAnimationsModule,
    QRCodeModule,
    UnauthorizedModule,
    AdvancedDataUserModule,
    NotFoundModule,
    TimeOutModule,
    LoginModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule {
  constructor(router: Router, viewportScroller: ViewportScroller) {
    viewportScroller.setOffset([0, 60]);
    router.events
      .pipe(filter((e: any) => e instanceof Scroll))
      .subscribe((e: Scroll) => {
        if (e.anchor) {
          let anchor = e.anchor;
          setTimeout(() =>
            //anchor navigation
            viewportScroller.scrollToAnchor(anchor)
          );
        } else if (e.position) {
          viewportScroller.scrollToPosition(e.position);
        } else {
          //forward navigation
          viewportScroller.scrollToPosition([0, 0]);
        }
      });
  }
}
