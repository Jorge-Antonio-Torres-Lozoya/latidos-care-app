import { Component, OnDestroy, OnInit } from '@angular/core';
import { ProfileUserService } from '../profile-user.service';
import { Subscription } from 'rxjs';
import { SsrCookieService } from 'ngx-cookie-service-ssr';

@Component({
  selector: 'app-my-qrcode',
  templateUrl: './my-qrcode.component.html',
  styleUrls: ['./my-qrcode.component.css']
})
export class MyQrcodeComponent implements OnInit {
  userId:string = this.cookieService.get('user_id')!
  token?:string;

  constructor(private profileUserService:ProfileUserService, private cookieService: SsrCookieService) {}

  ngOnInit(): void {
    this.profileUserService.generateVerificationTokenUser(this.userId).subscribe((token) => {
      this.token = token.verificationToken;
    });
  }


}
