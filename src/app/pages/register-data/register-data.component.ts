import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { NgForm } from '@angular/forms';
import { AllergyInterface } from '../../shared/interfaces/allergy.interface';
import { SicknessInterface } from '../../shared/interfaces/sickness.interface';
import { MedicationInterface } from '../../shared/interfaces/medication.interface';
import { Observable, Subscription, switchMap } from 'rxjs';
import { TrackingValueInterface } from '../../shared/interfaces/tracking-value.interface';
// import { CurrentValues } from '../../shared/interfaces/current-values.interface';
import { ProfileUserService } from '../profile-user/profile-user.service';
import { CreateSicknessInterface } from '../profile-admin/interfaces/create-sickness.interface';
import { UpdateSicknessInterface } from '../../shared/interfaces/update-sickness.interface';
import { CreateMedicationInterface } from '../profile-admin/interfaces/create-medication.interface';
import { UpdateMedicationInterface } from '../../shared/interfaces/update-medication.interface';
import { CreateAllergiesInterface } from '../profile-admin/interfaces/create-allergies.interface';
import { UpdateAllergyInterface } from '../../shared/interfaces/update-allergy.interface';
import { RegisterDataService } from './register-data.service';
import { SsrCookieService } from 'ngx-cookie-service-ssr';

@Component({
  selector: 'app-register-data',
  templateUrl: './register-data.component.html',
  styleUrls: ['./register-data.component.css']
})
export class RegisterDataComponent implements OnInit {
  userId?:string;
  errorCurrentValue?:string;
  errorTreatment?:string;
  displayConfirmation: string = 'none';
  isLoadingValues:boolean = true;
  valuesDisplays:boolean = false;
  valuesEmpty:boolean = false;
  treatmentsDisplay:boolean = false;
  isLoadingTreatments:boolean = true;
  treatmentsEmpty:boolean = false;
  sicknesses?: SicknessInterface[];
  sicknessUsb?: Subscription;
  allergies?: AllergyInterface[]
  allergiesUsb?:Subscription
  trackingValues?: TrackingValueInterface[];
  trackingValuesUsb?: Subscription;
  // currentValues?:CurrentValues[];
  currentValuesUsb?:Subscription;
  treatments?:any[];
  treatmentsUsb?:Subscription;
  timeFrameOfTreatment?:string;

  //medications
  medications?:MedicationInterface[];
  currentMedication?:MedicationInterface;
  currentMedicationId?:string;
  displayMedicationOptionsModal:string = 'none';
  displayMedicationViewModal:string = 'none';
  displayMedicationEditModal:string = 'none';
  displayMedicationDeleteModal:string = 'none';
  confirmEditMedicine:boolean = false;

  //sickness
  sicknessById?: SicknessInterface
  displayDeleteModal: string = 'none';
  displayCreateModal: string = 'none';
  displayViewModal: string = 'none';
  displayEditModal: string = 'none';
  currentSicknessId?: number;
  currentSickness?: SicknessInterface;
  confirmAddedSickness:boolean = false;
  confirmUpdatedSickness:boolean = false;
  confirmUpdatedCurrentValue:boolean = false;
  confirmAddMedicine:boolean = false;
  errorAlertMedication?: string = undefined;
  errorAlert?: string = undefined;

  //allergies
  allergyById?: AllergyInterface
  displayAllergyDeleteModal: string = 'none';
  displayAllergyCreateModal: string = 'none';
  displayAllergyViewModal: string = 'none';
  displayAllergyEditModal: string = 'none';
  currentAllergyId?: number;
  currentAllergy?: AllergyInterface;
  confirmAddedAllergy:boolean = false;
  confirmUpdatedAllergy:boolean = false;
  errorAllergyAlert?: string = undefined;


  constructor(
    private profileUserService: ProfileUserService,
    private route: ActivatedRoute,
    private router: Router,
    private registerDataService: RegisterDataService,
    private cookieService: SsrCookieService
    ) {}

  ngOnInit(): void {
    this.userId = this.cookieService.get('user_id')!;
    // this.sicknessUsb = this.profileUserService.getAllSicknessByUser(this.userId).subscribe((response) => {
    //   this.sicknesses = response;
    // });
    // this.allergiesUsb = this.profileUserService.getAllergiesByUser(this.userId).subscribe((response) => {
    //   this.allergies = response;
    // });
  }

  toDashboard() {
    this.router.navigateByUrl(`/perfil-paciente`);
  }

  setCurrentMedication(medication:MedicationInterface) {
    this.currentMedication = medication;
    this.currentMedicationId = medication.medicationId!.toString();
  }

  handleErrorCurrentValue() {
    this.errorCurrentValue = undefined;
  }

  handleErrorTreatment() {
    this.errorTreatment = undefined;
  }
//Sickness
handleError?() {
  this.errorAlert = undefined;
}
handleErrorMedication?() {
  this.errorAlertMedication = undefined;
}

// getSicknessById(idSickness: number): Observable<any> {
//   this.currentSicknessId = idSickness;
//   return this.profileUserService
//     .getSicknessById(this.currentSicknessId!.toString())
//     .pipe(
//       switchMap((sicknessById) => {
//         this.sicknessById = sicknessById;
//         return new Observable((observer) => {
//           observer.next();
//           observer.complete();
//         });
//       })
//     );
// }

// deleteSickness() {
//   this.profileUserService
//     .deleteSickness(this.currentSicknessId!.toString())
//     .subscribe((response) => {
//       this.sicknesses = this.sicknesses!.filter(
//         (sickness) =>
//           sickness.sicknessId !== this.currentSicknessId
//       );
//       this.displayDeleteModal = 'none';
//     });
// }

// addPersonalizedSickness(form: NgForm) {
//   const sicknessData: CreateSicknessInterface = form.value;
//   sicknessData.userId = Number(this.userId);
//   this.profileUserService.createSickness(sicknessData).subscribe(
//     (response) => {
//       this.confirmAddedSickness = true;
//       this.profileUserService
//         .getAllSicknessByUser(this.userId!)
//         .subscribe((sicknesses) => {
//           this.sicknesses = sicknesses;
//         });
//     },
//     (errorMessage) => {
//       console.log(errorMessage);
//       this.errorAlert = errorMessage;
//     }
//   );
//   form.reset();
// }
// updateSickness: ( formData: NgForm) => void = (
//   formData
// ) => {
//   if (!formData.value) {
//     return;
//   }
//   const updatedData: UpdateSicknessInterface = formData.value;
//   this.profileUserService
//     .editSickness(updatedData, this.currentSicknessId!.toString())
//     .subscribe((response) => {
//       this.confirmUpdatedSickness = true;
//       this.profileUserService
//       .getAllSicknessByUser(this.userId!)
//       .subscribe((sicknesses) => {
//         this.sicknesses = sicknesses;
//         this.profileUserService.getSicknessById(this.currentSicknessId!.toString()).subscribe((response)=>{
//           this.currentSickness = response;
//         });
//       });
//     });
//     formData.reset();
// };

// AddMedication(sicknessId: number, formData: NgForm) {
//   if (!formData.value) {
//     return;
//   }
//   const medicationData: CreateMedicationInterface = formData.value;
//   medicationData.sicknessId = sicknessId;
//   medicationData.userId = Number(this.userId);
//   this.profileUserService.createMedication(medicationData).subscribe(
//     (response) => {
//       this.confirmAddMedicine = true;
//       this.profileUserService
//         .getAllSicknessByUser(this.userId!)
//         .subscribe((sicknesses) => {
//           this.sicknesses = sicknesses;
//         });
//     },
//     (errorMessage) => {
//       console.log(errorMessage);
//       this.errorAlertMedication = errorMessage;
//     }
//   );
//   formData.reset();
// }

// //medication
// goToMedications(medication: MedicationInterface) {
//   this.currentMedication = medication
//   this.currentMedicationId = medication.medicationId!.toString();
//   this.displayViewModal = 'none';
//   this.displayMedicationOptionsModal = 'block';
// }

// openMedicationEdit() {
//   this.displayMedicationOptionsModal = 'none';
//   this.displayMedicationEditModal = 'block';
// }

// openMedicationView() {
//   this.displayMedicationOptionsModal = 'none';
//   this.displayMedicationViewModal = 'block';
// }

// openMedicationDelete() {
//   this.displayMedicationOptionsModal = 'none';
//   this.displayMedicationDeleteModal = 'block';
// }

// closeDeleteMedicationModal() {
//   this.displayMedicationDeleteModal = 'none';
//   this.currentMedication = undefined;
//   this.currentMedicationId = undefined;
// }
// closeViewMedicationModal() {
//   this.displayMedicationViewModal = 'none';
//   this.currentMedication = undefined;
//   this.currentMedicationId = undefined;
// }
// closeEditMedicationModal() {
//   this.displayMedicationEditModal = 'none';
//   this.currentMedication = undefined;
//   this.currentMedicationId = undefined;
// }
// closeOptionsMedicationModal() {
//   this.displayMedicationOptionsModal = 'none';
//   this.currentMedication = undefined;
//   this.currentMedicationId = undefined;
// }

// deleteUserMedication() {
//   this.profileUserService
//     .deleteMedication(this.currentMedicationId!.toString())
//     .subscribe((response) => {
//       this.sicknessUsb = this.profileUserService.getAllSicknessByUser(this.userId!).subscribe((response) => {
//         this.sicknesses = response;
//       });
//       this.displayMedicationDeleteModal = 'none';
//     });
// }

// updateMedication: ( formData: NgForm) => void = (
//   formData
// ) => {
//   if (!formData.value) {
//     return;
//   }
//   const updatedData: UpdateMedicationInterface = {};
//   if (formData.value.medicationName) {
//     updatedData['medicationName'] = formData.value.medicationName;
//   }
//   if (formData.value.timeConsumption) {
//     updatedData['timeConsumption'] = formData.value.timeConsumption;
//   }

//   this.profileUserService
//     .updateMedication(updatedData, this.currentMedicationId!.toString())
//     .subscribe((response) => {
//       this.confirmEditMedicine = true;
//       this.currentMedication = response;
//       this.sicknessUsb = this.profileUserService.getAllSicknessByUser(this.userId!).subscribe((response) => {
//         this.sicknesses = response;
//       });
//       this.displayMedicationEditModal = 'none';
//     });
//     formData.reset();
// };

// closeEditMedicationConfirmation() {
//   this.confirmEditMedicine = false;
// }

// closeDeleteSicknessModal() {
//   this.displayDeleteModal = 'none';
// }
// closeViewModal() {
//   this.displayViewModal = 'none';
// }
// closeEditModal() {
//   this.displayEditModal = 'none';
// }
// closeCreateModal() {
//   this.displayCreateModal = 'none';
// }
// OpenModalCreate() {
//   this.displayCreateModal = 'block';
// }

// openDeleteModal(idSickness: number) {
//   this.currentSicknessId = idSickness;
//   this.getSicknessById(idSickness).subscribe(() => {
//     this.displayDeleteModal = 'block';
//   });
// }
// openViewModal(idSickness: number) {
//   this.currentSicknessId = idSickness;
//   this.getSicknessById(idSickness).subscribe(() => {
//     this.displayViewModal = 'block';
//   });
// }
// openEditModal(idSickness: number) {
//   this.currentSicknessId = idSickness;
//   this.profileUserService.getSicknessById(idSickness.toString()).subscribe((response)=>{
//     this.currentSickness = response;
//     this.displayEditModal = 'block';
//   });
// }

// closeConfirmSicknesUpdate() {
//   this.confirmUpdatedSickness = false;
// }

// closeConfirmValueUpdate() {
//   this.confirmUpdatedCurrentValue = false;
// }

// closeConfirmAddMedication() {
//   this.confirmAddMedicine = false;
// }

// closeConfirmAddSickness() {
//   this.confirmAddedSickness = false;
// }

// //Allergies
// handleAllergyError?() {
//   this.errorAllergyAlert = undefined;
// }

// getAllergyById(idAllergy: number): Observable<any> {
//   this.currentAllergyId = idAllergy;
//   return this.profileUserService
//     .getAllergyById(this.currentAllergyId!.toString())
//     .pipe(
//       switchMap((allergyById) => {
//         this.allergyById = allergyById;
//         return new Observable((observer) => {
//           observer.next();
//           observer.complete();
//         });
//       })
//     );
// }

// deleteAllergy() {
//   this.profileUserService
//     .deleteAllergy(this.currentAllergyId!.toString())
//     .subscribe((response) => {
//       this.allergies = this.allergies!.filter(
//         (allergy) =>
//         allergy.allergyId !== this.currentAllergyId
//       );
//       this.displayAllergyDeleteModal = 'none';
//     });
// }

// addAllergy(form: NgForm) {
//   const allergyData: CreateAllergyInterface = form.value;
//   allergyData.userId = Number(this.userId);
//   this.profileUserService.createAllergy(allergyData).subscribe(
//     (response) => {
//       this.confirmAddedAllergy = true;
//       this.profileUserService
//         .getAllergiesByUser(this.userId!)
//         .subscribe((allergies) => {
//           this.allergies = allergies;
//         });
//     },
//     (errorMessage) => {
//       console.log(errorMessage);
//       this.errorAlert = errorMessage;
//     }
//   );
//   form.reset();
// }
// updateAllergy: ( formData: NgForm) => void = (
//   formData
// ) => {
//   if (!formData.value) {
//     return;
//   }
//   const updatedData: UpdateAllergyInterface = {};
//   if (formData.value.allergyName) {
//     updatedData['allergyName'] = formData.value.allergyName;
//   }
//   this.profileUserService
//     .updateAllergy(updatedData, this.currentAllergyId!.toString())
//     .subscribe((response) => {
//       this.confirmUpdatedAllergy = true;
//       this.profileUserService
//       .getAllergiesByUser(this.userId!)
//       .subscribe((allergies) => {
//         this.allergies = allergies;
//         this.profileUserService.getAllergyById(this.currentAllergyId!.toString()).subscribe((response)=>{
//           this.currentAllergy = response;
//         });
//       });
//     });
// };

// closeDeleteAllergyModal() {
//   this.displayAllergyDeleteModal = 'none';
// }
// closeAllergyViewModal() {
//   this.displayAllergyViewModal = 'none';
// }
// closeAllergyEditModal() {
//   this.displayAllergyEditModal = 'none';
// }
// closeAllergyCreateModal() {
//   this.displayAllergyCreateModal = 'none';
// }
// OpenAllergyModalCreate() {
//   this.displayAllergyCreateModal = 'block';
// }

// openAllergyDeleteModal(idAllergy: number) {
//   this.currentAllergyId = idAllergy;
//   this.getAllergyById(idAllergy).subscribe(() => {
//     this.displayAllergyDeleteModal = 'block';
//   });
// }
// openAllergyViewModal(idAllergy: number) {
//   this.currentAllergyId = idAllergy;
//   this.getAllergyById(idAllergy).subscribe(() => {
//     this.displayAllergyViewModal = 'block';
//   });
// }
// openAllergyEditModal(idAllergy: number) {
//   this.currentAllergyId = idAllergy;
//   this.profileUserService.getAllergyById(idAllergy.toString()).subscribe((response)=>{
//     this.currentAllergy = response;
//     this.displayAllergyEditModal = 'block';
//   });
// }

// closeConfirmAllergyUpdate() {
//   this.confirmUpdatedAllergy = false;
// }

// closeConfirmAddAllergy() {
//   this.confirmAddedAllergy = false;
// }

ngOnDestroy(): void {
  if(this.sicknessUsb) {
    this.sicknessUsb.unsubscribe();
  }
  if(this.currentValuesUsb) {
    this.currentValuesUsb.unsubscribe();
  }
  if(this.allergiesUsb) {
    this.allergiesUsb.unsubscribe();
  }
  if(this.trackingValuesUsb) {
    this.trackingValuesUsb.unsubscribe();
  }
  // this.registerDataService.updateRegisterDataAccount(this.accountId!).subscribe();
}

}
