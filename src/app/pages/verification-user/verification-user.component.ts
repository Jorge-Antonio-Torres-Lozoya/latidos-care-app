import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { VerificationUserService } from './verification-user.service';
import { VerificationUserInterface } from '../../shared/interfaces/verify-user.interface';

@Component({
  selector: 'app-verification-user',
  templateUrl: './verification-user.component.html',
  styleUrls: ['./verification-user.component.css']
})
export class VerificationUserComponent implements OnInit {
  token = this.route.snapshot.queryParamMap.get('token');

  constructor(private route: ActivatedRoute, private verificationUserService: VerificationUserService, private router: Router) { }

  ngOnInit(): void {
    const formData:VerificationUserInterface = {verificationCode: parseInt(this.token!)};
    this.verificationUserService.verifyUser(formData).subscribe();
  }

  toLogin() {
    this.router.navigateByUrl(`login`);
  }

}
