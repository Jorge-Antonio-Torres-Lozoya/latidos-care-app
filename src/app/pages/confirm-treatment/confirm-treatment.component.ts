import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { MedicationInterface } from '../../shared/interfaces/medication.interface';
import { Subscription } from 'rxjs';
import { ConfirmTreatmentService } from './confirm-treatment.service';
import { CreateTreatmentInterface } from '../../shared/interfaces/create-treatment.interface';


@Component({
  selector: 'app-confirm-treatment',
  templateUrl: './confirm-treatment.component.html',
  styleUrls: ['./confirm-treatment.component.css']
})
export class ConfirmTreatmentComponent implements OnInit, OnDestroy {
  medicationId = this.route.snapshot.paramMap.get('medicationId');
  medication?:MedicationInterface;
  medicationUsb?:Subscription;
  selectedRadio?:string
  treatmentUsb?:Subscription;
  confirmationModal:string = 'none';

  constructor(private route: ActivatedRoute, private confirmTreatmentService:ConfirmTreatmentService) {}

  ngOnInit(): void {
    this.medicationUsb = this.confirmTreatmentService.getMedicationById(this.medicationId!).subscribe((response) => {
      this.medication = response;
    })
  }

  // createTreatment() {
  //   let treatmentData:CreateTreatmentInterface = {medicationId: 0, taken: false}
  //   if(this.selectedRadio) {
  //     treatmentData.taken = true;
  //     treatmentData.medicationId = parseInt(this.medicationId!)
  //   } else {
  //     treatmentData.taken = false;
  //     treatmentData.medicationId = parseInt(this.medicationId!)
  //   }
  //   this.treatmentUsb = this.confirmTreatmentService.createTreatment(treatmentData).subscribe((response) => {
  //     this.confirmationModal = 'block';
  //   })

  // }

  confirmationHideModal() {
    this.confirmationModal = 'none';
  }

  ngOnDestroy(): void {
    this.medicationUsb?.unsubscribe();
  }
}
