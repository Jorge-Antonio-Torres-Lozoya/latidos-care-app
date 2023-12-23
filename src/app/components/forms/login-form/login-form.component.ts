import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-login-form',
  templateUrl: './login-form.component.html',
  styleUrls: ['./login-form.component.css']
})
export class LoginFormComponent implements OnInit {
  @Input() error?: string = '';
  @Input() showPassword: { value: boolean } = { value: false };
  @Input() handleError?: () => void;
  @Input() loginFun?: (value: any) => void;
  @Input() passwordFun: () => void = () => {};
  @Input() openRecoverPassword: () => void = () => {};
  @Input() displayPasswordModal: string = 'none';
  @Input() closePasswordModal?: () => void;
  @Input() recoverFun?: (value: any) => void;
  @Input() handleErrorRecover?: () => void;
  @Input() errorRecover?: string = '';
  @Input() displayRecoverPasswordConfirmation: string = 'none';
  @Input() closeRecoverPasswordConfirmation?: () => void;


  constructor() { }

  ngOnInit(): void {
  }

}
