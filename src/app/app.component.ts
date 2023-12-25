import { Component, OnInit } from '@angular/core';
//import { LoginAdminService } from './pages/login-admin/login-admin.service';
import { LoginUserService } from './pages/login-user/login-user.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  constructor(
    //private adminLoginService: LoginAdminService,
    private userLoginService: LoginUserService
  ) {}

  ngOnInit():void {
    //this.adminLoginService.adminAutoLogin();
    this.userLoginService.userAutoLogin();
  }
  title = 'LatidosCare';
}
