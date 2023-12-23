import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { SicknessInterface } from '../../../shared/interfaces/sickness.interface';
import { ProfileAdminService } from '../profile-admin.service';
import { InputForm } from '../../../components/profile/profile-edit/profile-edit.component';

@Component({
  selector: 'app-create-sickness',
  templateUrl: './create-sickness.component.html',
  styleUrls: ['./create-sickness.component.css'],
})
export class CreateSicknessComponent implements OnInit {
  headerText = 'Crear Enfermedad';
  buttonText = 'Crear nueva enfermedad';
  createSicknessInputForm?:InputForm[]
  sickness?: SicknessInterface;
  displayCreateModal = 'none';

  myHandleErrorFunction() {
    this.errorAlert = undefined
  }
errorAlert?: string= undefined

  mySicknessCreateFunction: (value:any) => void = (formData:NgForm) => {
    if(!formData.value){
      return
    }
    const sendData:SicknessInterface = {};
    if (formData.value.sicknessName) {
      sendData['sicknessName'] = formData.value.sicknessName;
    }
    this.createSicknessService.createSickness(sendData).subscribe(response => {
      this.displayCreateModal = 'block';
    },
    errorMessage => {
      console.log(errorMessage)
      this.errorAlert = errorMessage
    })
   formData.resetForm()
  }
  closeModal() {
    this.displayCreateModal = 'none';
  }

  constructor(private createSicknessService: ProfileAdminService) {}

  ngOnInit(): void {
    this.createSicknessInputForm = [
      {
        inputType: 'text',
        inputId: 'sicknessName',
        inputLabel: 'Nombre de la enfermedad',
        inputName: 'sicknessName',
        inputPlaceholder: 'Ingrese el nombre de la enfermedad',
        inputValue: this.sickness?.sicknessName,
      },
    ];
  }
}
