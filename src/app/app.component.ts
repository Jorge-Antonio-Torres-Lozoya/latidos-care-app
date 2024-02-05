import { Component, OnInit } from '@angular/core';
import { LoginService } from './pages/login/login.service';
//import { LoginAdminService } from './pages/login-admin/login-admin.service';


@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  constructor(
    //private adminLoginService: LoginAdminService,
    private loginService: LoginService
  ) {}

  ngOnInit():void {
    //this.adminLoginService.adminAutoLogin();
    this.loginService.accountAutoLogin();
  }
  title = 'LatidosCare';
}
