import { Component, OnInit } from '@angular/core';
import { ProfileAdminService } from '../profile-admin.service';
import { SicknessInterface } from '../../../shared/interfaces/sickness.interface';
import { NgForm } from '@angular/forms';

import { Subscription } from 'rxjs';
import { ActivatedRoute } from '@angular/router';
import { InputForm } from '../../../components/profile/profile-edit/profile-edit.component';

@Component({
  selector: 'app-edit-sickness',
  templateUrl: './edit-sickness.component.html',
  styleUrls: ['./edit-sickness.component.css'],
})
export class EditSicknessComponent implements OnInit {
  sicknessId = this.route.snapshot.paramMap.get('sicknessId');
  headerText = 'Editar enfermedad';
  sickness?: SicknessInterface;
  sicknessUsb?: Subscription;
  buttonText = 'Actualizar enfermedad';
  editSicknessInputForm?:InputForm[]
  displayModalEdit= 'none';
  myHandleErrorFunction() {
    this.errorAlert = undefined
  }
errorAlert?: string= undefined
  constructor(
    private route: ActivatedRoute,
    private editSicknessService: ProfileAdminService
  ) {}

 mySicknessEditFunction: (value:any) => void = (formData:NgForm) => {
    if(!formData.value){
      return
    }
    const updatedData:SicknessInterface = {};
    if (formData.value.sicknessName) {
      updatedData['sicknessName'] = formData.value.sicknessName;
    }
    this.editSicknessService.editSickness(updatedData, this.sicknessId!).subscribe(response => {
       this.displayModalEdit = 'block';
    }
    )

  }
  closeModal() {
    this.displayModalEdit = 'none';
  }
  ngOnInit(): void {
    this.sicknessUsb = this.editSicknessService
      .getSicknessById(this.sicknessId!)
      .subscribe((response) => {
        this.sickness = response;
        this.editSicknessInputForm = [
          {
            inputType: 'text',
            inputId: 'sicknessName',
            inputLabel: 'Nombre de la enfermedad',
            inputName: 'sicknessName',
            inputPlaceholder: this.sickness?.sicknessName,
            inputValue: this.sickness?.sicknessName,
          },
        ];
      });



  }
}
