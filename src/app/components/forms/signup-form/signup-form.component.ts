import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-signup-form',
  templateUrl: './signup-form.component.html',
  styleUrls: ['./signup-form.component.css']
})
export class SignupFormComponent implements OnInit {
  @Input() error?: string = '';
  @Input() showPassword: { value: boolean } = { value: false };
  @Input() handleError?: () => void;
  @Input() signupFun?: (value: any) => void;
  @Input() passwordFun: () => void = () => {};

  constructor() { }

  ngOnInit(): void {
  }

}
