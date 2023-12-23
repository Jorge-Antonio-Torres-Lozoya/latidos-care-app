import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-profile-edit',
  templateUrl: './profile-edit.component.html',
  styleUrls: ['./profile-edit.component.css']
})
export class ProfileEditComponent implements OnInit {
  @Input() handleErrorEdit?: () => void;
  @Input() errorEdit?: string
  @Input() editFun?: (value: any) => void;
  @Input() handleErrorPassword?: () => void;
  @Input() errorPassword?: string
  @Input() passwordEditFun?: (value: any) => void;
  @Input() passwordFun: () => void = () => {};
  @Input() showPassword: { value: boolean } = { value: false };
  @Input() newPasswordFun: () => void = () => {};
  @Input() newShowPassword: { value: boolean } = { value: false };
  @Input() inputForm?: InputForm[] = [];
  @Input() editModal?: string;
  @Input() editHideModal?: () => void;

  constructor() { }

  ngOnInit(): void {
  }

}

export interface InputForm {
  inputType: string;
  inputId: string;
  inputLabel: string;
  inputName:string;
  inputPlaceholder?:string | number;
  inputValue?: string | number;
}
