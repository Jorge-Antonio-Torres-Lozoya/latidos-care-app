import { Component } from '@angular/core';
import { SignupInterface } from '../../../shared/interfaces/signup.interface';
import { ProfileAdminService } from '../profile-admin.service';
import { Router } from '@angular/router';
import { NgForm } from '@angular/forms';

@Component({
  selector: 'app-register-admin',
  templateUrl: './register-admin.component.html',
  styleUrls: ['./register-admin.component.css']
})
export class RegisterAdminComponent {
  errorSignup:boolean = false;
  displayConfirmSignup:boolean = false;

  constructor(private profileAdminService: ProfileAdminService,private router:Router) { }

  onSubmit(form:NgForm){
    if(!form.value){
      return;
    }
    const signupData:SignupInterface=form.value;
    this.profileAdminService.signupAdmin(signupData).subscribe((data)=>{
      this.displayConfirmSignup = true;
    },(error)=>{
      this.errorSignup = error;
    });
    form.reset();
  }

  closeErrorSignup(){
    this.errorSignup = false;
  }

  closeConfirmSignup(){
    this.displayConfirmSignup = false;
  }
}
