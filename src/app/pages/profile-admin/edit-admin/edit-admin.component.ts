import { Component, OnInit } from '@angular/core';
import { AdminInterface } from '../../../shared/interfaces/admin.interface';
import { Subscription } from 'rxjs';
import { NgForm } from '@angular/forms';
import { InputForm } from '../../../components/profile/profile-edit/profile-edit.component';
import { ProfileAdminService } from '../profile-admin.service';
import { AdminEditInterface } from '../../../shared/interfaces/admin-edit.interface';
import { SsrCookieService } from 'ngx-cookie-service-ssr';

@Component({
  selector: 'app-edit-admin',
  templateUrl: './edit-admin.component.html',
  styleUrls: ['./edit-admin.component.css']
})
export class EditAdminComponent implements OnInit {
  adminId?:string;
  admin?: AdminInterface
  adminUsb?: Subscription
  adminHandleErrorEdit() {
    this.adminErrorEdit = undefined
  }
  adminErrorEdit?: string = undefined;
  hideModal() {
    this.confirmationModal = 'none';
  }
  confirmationModal?: string = 'none';
  adminEditFun: (value:any) => void = (formData:NgForm) => {
    if(!formData.value){
      return
    }
    const updatedData:AdminEditInterface = {};
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
      updatedData['phoneNumber'] = Number(formData.value.phoneNumber);
    }
    this.profileAdminService.editAdmin(updatedData, this.adminId!).subscribe(response => {
      this.confirmationModal = 'block';
    }, errorMessage => {
      console.log(errorMessage)
      this.adminErrorEdit = errorMessage
    })
  }
  adminHandleErrorPassword() {
    this.adminErrorPassword = undefined
  }
  adminErrorPassword?: string = undefined;
  adminPasswordEditFun: (value:any) => void = (formData:NgForm) => {
    if(!formData.value){
      return
    }
    const passwordData = formData.value;
    this.profileAdminService.editAdminPassword(passwordData, this.adminId!).subscribe(response => {
      this.confirmationModal = 'block';
    }, errorMessage => {
      console.log(errorMessage);
      this.adminErrorPassword = errorMessage;
    })
    formData.reset()
  }
  adminPasswordFun() {
    this.adminShowPassword.value = !this.adminShowPassword.value;
  }
  adminShowPassword: { value: boolean } = { value: false };
  adminNewPasswordFun() {
    this.adminNewShowPassword.value = !this.adminNewShowPassword.value;
  }
  adminNewShowPassword: { value: boolean } = { value: false };
  adminInputForm?:InputForm[]

  constructor(private profileAdminService: ProfileAdminService, private cookieService: SsrCookieService) { }

  ngOnInit(): void {
    this.adminId = this.cookieService.get('admin_id')!
    this.adminUsb = this.profileAdminService.getAdmin(this.adminId!).subscribe((response) => {
      this.admin = response;
      this.adminInputForm = [
        {
          inputType: 'text',
          inputId: 'firstName',
          inputLabel: 'Nombres',
          inputName: 'firstName',
          inputPlaceholder: this.admin?.firstName ? this.admin?.firstName : '',
          inputValue: this.admin.firstName
        },
        {
          inputType: 'text',
          inputId: 'lastName',
          inputLabel: 'Apellidos',
          inputName: 'lastName',
          inputPlaceholder: this.admin?.lastName ? this.admin?.lastName : '',
          inputValue: this.admin.lastName
        },
        {
          inputType: 'email',
          inputId: 'email',
          inputLabel: 'Correo Electrónico',
          inputName: 'email',
          inputPlaceholder: this.admin?.email ? this.admin?.email : '',
          inputValue: this.admin.email
        },
        {
          inputType: 'number',
          inputId: 'phoneNumber',
          inputLabel: 'Celular',
          inputName: 'phoneNumber',
          inputPlaceholder: this.admin?.phoneNumber ? this.admin?.phoneNumber : '',
          inputValue: this.admin.phoneNumber
        },
      ];
    })
  }

}
