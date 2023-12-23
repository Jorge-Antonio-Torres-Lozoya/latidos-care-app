import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { RecoverPasswordUser } from '../../shared/interfaces/recover-password-user.interface';
import { RecoverPasswordUserService } from './recover-password-user.service';

@Component({
  selector: 'app-recover-password-user',
  templateUrl: './recover-password-user.component.html',
  styleUrls: ['./recover-password-user.component.css']
})
export class RecoverPasswordUserComponent implements OnInit {
  token = this.route.snapshot.queryParamMap.get('token')!
  error?:string;
  errorDefined:boolean = false;
  userId = this.route.snapshot.paramMap.get('id');
  displayModal:string = 'none';
  showPassword:boolean = false;

  constructor(private router: Router, private recoverPasswordUser: RecoverPasswordUserService, private route: ActivatedRoute) {}

  ngOnInit(): void {
    console.log(this.token);
      this.recoverPasswordUser.validateVerificationTokenUser(this.userId!, this.token).subscribe((response) => {
        if(response.validated === false) {
          this.router.navigate(['unauthorized']);
        }
    })
  }


  recoverPassword(form:NgForm) {
    const passwordData:RecoverPasswordUser = form.value;
    this.recoverPasswordUser.recoverPassword(this.userId!, passwordData).subscribe((response) => {
      this.displayModal = 'block';
    }, errorMessage => {
      console.log(errorMessage)
      this.errorDefined = true;
        this.error = errorMessage;
    })
  }

  toLogin() {
    this.router.navigateByUrl(`login`);
  }

  closeError() {
    this.errorDefined = false;
  }

  closeModal() {
    this.displayModal = 'none'
  }

  passwordFun(){
    this.showPassword = !this.showPassword;
  }

}
