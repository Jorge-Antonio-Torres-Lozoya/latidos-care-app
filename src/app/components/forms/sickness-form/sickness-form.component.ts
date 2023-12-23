import { Component, Input, OnInit } from '@angular/core';
import { InputForm } from '../../profile/profile-edit/profile-edit.component';

@Component({
  selector: 'app-sickness-form',
  templateUrl: './sickness-form.component.html',
  styleUrls: ['./sickness-form.component.css'],
})
export class SicknessFormComponent implements OnInit {
  @Input() sicknessName: string = '';
  @Input() minLimit?: number;
  @Input() maxLimit?: number;
  @Input() headerText: string = '';
  @Input() buttonText: string = '';
  @Input() displayModal: string= '' ;
  @Input() sicknessFun?: (value: any) => void;
  @Input() closeModal:  () => void = () => {};
  @Input() inputForm?: InputForm[] = [];
  @Input() errorAlert?: string
  @Input() handleError?: () => void;

  constructor() {}

  ngOnInit(): void {}
}
