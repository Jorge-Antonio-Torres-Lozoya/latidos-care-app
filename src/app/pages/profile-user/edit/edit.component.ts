import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { UserInterface } from '../../../shared/interfaces/user.interface';
import { Subscription } from 'rxjs';
import { ProfileUserService } from '../profile-user.service';
import { InputForm } from '../../../components/profile/profile-edit/profile-edit.component';
import { UserEditInterface } from '../../../shared/interfaces/user-edit.interface';
import { SsrCookieService } from 'ngx-cookie-service-ssr';

@Component({
  selector: 'app-edit',
  templateUrl: './edit.component.html',
  styleUrls: ['./edit.component.css']
})
export class EditComponent implements OnInit {
  userId?:string;
  user?: UserInterface
  userUsb?: Subscription
  userHandleErrorEdit() {
    this.userErrorEdit = undefined
  }
  userErrorEdit?: string = undefined;
  hideModal() {
    this.confirmationModal = 'none';
  }
  confirmationModal?: string = 'none';
  userEditFun: (value:any) => void = (formData:NgForm) => {
    if(!formData.value){
      return
    }
    const updatedData:UserEditInterface = {};
    if (formData.value.firstName) {
      updatedData['firstName'] = formData.value.firstName;
    }
    if (formData.value.lastName) {
      updatedData['lastName'] = formData.value.lastName;
    }
    if (formData.value.email) {
      updatedData['email'] = formData.value.email;
    }
    if (formData.value.phoneNumber) {
      updatedData['phoneNumber'] = formData.value.phoneNumber;
    }
    if (formData.value.dni) {
      updatedData['dni'] = formData.value.dni;
    }
    if (formData.value.tutorFirstName) {
      updatedData['tutorFirstName'] = formData.value.tutorFirstName;
    }
    if (formData.value.tutorLastName) {
      updatedData['tutorLastName'] = formData.value.tutorLastName;
    }
    if (formData.value.tutorPhoneNumber) {
      updatedData['tutorPhoneNumber'] = formData.value.tutorPhoneNumber;
    }
    this.profileUserService.editUser(updatedData, this.userId!).subscribe(response => {
      this.confirmationModal = 'block';
    }, errorMessage => {
      console.log(errorMessage)
      this.userErrorEdit = errorMessage
    })
  }
  userHandleErrorPassword() {
    this.userErrorPassword = undefined
  }
  userErrorPassword?: string = undefined;
  userPasswordEditFun: (value:any) => void = (formData:NgForm) => {
    if(!formData.value){
      return
    }
    const passwordData = formData.value;
    this.profileUserService.editUserPassword(passwordData, this.userId!).subscribe(response => {
      this.confirmationModal = 'block';
    }, errorMessage => {
      console.log(errorMessage);
      this.userErrorPassword = errorMessage;
    })
    formData.reset();
  }
  userPasswordFun() {
    this.userShowPassword.value = !this.userShowPassword.value;
  }
  userShowPassword: { value: boolean } = { value: false };
  userNewPasswordFun() {
    this.userNewShowPassword.value = !this.userNewShowPassword.value;
  }
  userNewShowPassword: { value: boolean } = { value: false };
  userInputForm?:InputForm[]

  constructor(private profileUserService: ProfileUserService, private cookieService: SsrCookieService) { }

  ngOnInit(): void {
    this.userId = this.cookieService.get('user_id')!
    this.userUsb = this.profileUserService.getUser(this.userId!).subscribe((response) => {
      this.user = response;
      this.userInputForm = [
        {
          inputType: 'text',
          inputId: 'firstName',
          inputLabel: 'Nombres',
          inputName: 'firstName',
          inputPlaceholder: this.user?.firstName ? this.user?.firstName : '',
          inputValue: this.user.firstName
        },
        {
          inputType: 'text',
          inputId: 'lastName',
          inputLabel: 'Apellidos',
          inputName: 'lastName',
          inputPlaceholder: this.user?.lastName ? this.user?.lastName : '' ,
          inputValue: this.user.lastName
        },
        {
          inputType: 'email',
          inputId: 'email',
          inputLabel: 'Correo Electrónico',
          inputName: 'email',
          inputPlaceholder: this.user?.email ? this.user?.email : '' ,
          inputValue: this.user.email
        },
        {
          inputType: 'number',
          inputId: 'phoneNumber',
          inputLabel: 'Celular',
          inputName: 'phoneNumber',
          inputPlaceholder: this.user?.phoneNumber ? this.user?.phoneNumber : '',
          inputValue: this.user.phoneNumber
        },
        {
          inputType: 'text',
          inputId: 'tutorFirstName',
          inputLabel: 'Nombres de familiar/tutor',
          inputName: 'tutorFirstName',
          inputPlaceholder: this.user?.tutorFirstName  ? this.user?.tutorFirstName : '',
          inputValue: this.user.tutorFirstName
        },
        {
          inputType: 'text',
          inputId: 'tutorLastName',
          inputLabel: 'Apellidos de familiar/tutor',
          inputName: 'tutorLastName',
          inputPlaceholder: this.user?.tutorLastName ? this.user?.tutorLastName : '' ,
          inputValue: this.user.tutorLastName
        },
        {
          inputType: 'number',
          inputId: 'tutorPhoneNumber',
          inputLabel: 'Celular de familiar/tutor',
          inputName: 'tutorPhoneNumber',
          inputPlaceholder: this.user?.tutorPhoneNumber ? this.user?.tutorPhoneNumber : '' ,
          inputValue: this.user.tutorPhoneNumber
        },
      ];
    })
  }
}
