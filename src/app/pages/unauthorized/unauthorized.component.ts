import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { LoginUserService } from '../login-user/login-user.service';
import { LoginAdminService } from '../login-admin/login-admin.service';
import { Subscription } from 'rxjs';
import { SsrCookieService } from 'ngx-cookie-service-ssr';

@Component({
  selector: 'app-unauthorized',
  templateUrl: './unauthorized.component.html',
  styleUrls: ['./unauthorized.component.css']
})
export class UnauthorizedComponent implements OnInit {
  userId:string = this.cookieService.get('user_id')!
  adminId:string = this.cookieService.get('admin_id')!
  userUsb?: Subscription;
  adminUsb?: Subscription;

  constructor(
    private router: Router,
    private loginUserService: LoginUserService,
    private loginAdminService: LoginAdminService,
    private cookieService: SsrCookieService
    ) { }

    ngOnInit(): void {
      this.userUsb = this.loginUserService.user?.subscribe(user => {
        const isAuthenticated:boolean = !!user;
        if(isAuthenticated) {
          this.router.navigateByUrl(`profile-user/${this.userId}`)
        }
      });
      this.adminUsb = this.loginAdminService.admin?.subscribe(admin => {
        const isAuthenticated:boolean = !!admin;
        if(isAuthenticated) {
          this.router.navigateByUrl(`protected/profile-admin/${this.adminId}`)
        }
      });
    }

}
