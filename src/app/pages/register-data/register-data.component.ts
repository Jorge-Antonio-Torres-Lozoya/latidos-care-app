import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { NgForm } from '@angular/forms';
import { AllergyInterface } from '../../shared/interfaces/allergy.interface';
import { SicknessInterface } from '../../shared/interfaces/sickness.interface';
import { MedicationInterface } from '../../shared/interfaces/medication.interface';
import { Observable, Subscription, switchMap } from 'rxjs';
import { TrackingValueInterface } from '../../shared/interfaces/tracking-value.interface';
import { ProfileUserService } from '../profile-user/profile-user.service';
import { RegisterDataService } from './register-data.service';
import { SsrCookieService } from 'ngx-cookie-service-ssr';
import { UserSicknessInterface } from '../../shared/interfaces/user-sickness.interface';
import { SharedService } from '../../shared/shared.service';
import { CreateMedicationSicknessInterface } from '../../shared/interfaces/create-medication-sickness.interface';
import { MedicationSicknessInterface } from '../../shared/interfaces/medication-sickness.interface';
import { UpdateMedicationSicknessInterface } from '../../shared/interfaces/update-medication-sickness.interface';
import { UserAllergyInterface } from '../../shared/interfaces/user-allergy.interface';
import { CreateUserAllergyInterface } from '../../shared/interfaces/create-user-allergy.interface';
import { CreateUserSicknessInterface } from '../../shared/interfaces/create-user-sickness.interface';
import { UserTrackingValueInterface } from '../../shared/interfaces/user-tracking-value.interface';

@Component({
  selector: 'app-register-data',
  templateUrl: './register-data.component.html',
  styleUrls: ['./register-data.component.css'],
})
export class RegisterDataComponent implements OnInit {
  accountId?: string;

  //medications
  currentMedication?: MedicationInterface;
  currentMedicationSickness?: MedicationSicknessInterface;
  medications?: MedicationInterface[];
  medicationsUsb?: Subscription;
  currentMedicationSicknessId?: number;
  currentMedicationId?: string;
  displayMedicationOptionsModal: string = 'none';
  displayMedicationViewModal: string = 'none';
  displayMedicationEditModal: string = 'none';
  displayMedicationDeleteModal: string = 'none';
  confirmEditMedicine: boolean = false;

  //sickness
  sicknessesByUser?: UserSicknessInterface[];
  userSicknessesUsb?: Subscription;
  sicknesses?: SicknessInterface[];
  sicknessUsb?: Subscription;
  displayDeleteModal: string = 'none';
  displayCreateModal: string = 'none';
  displayViewModal: string = 'none';
  displayEditModal: string = 'none';
  currentSicknessId?: number;
  currentSickness?: SicknessInterface;
  currentUserSickness?: UserSicknessInterface;
  currentUserSicknessId?: number;
  confirmAddedSickness: boolean = false;
  confirmAddMedicine: boolean = false;
  errorAlertMedication?: string = undefined;
  errorAlert?: string = undefined;

  //allergies
  displayAllergyDeleteModal: string = 'none';
  displayAllergyCreateModal: string = 'none';
  displayAllergyViewModal: string = 'none';
  displayAllergyEditModal: string = 'none';
  currentAllergyId?: number;
  currentAllergy?: AllergyInterface;
  confirmAddedAllergy: boolean = false;
  confirmUpdatedAllergy: boolean = false;
  errorAllergyAlert?: string = undefined;
  allergies?: AllergyInterface[];
  allergiesUsb?: Subscription;
  userAllergiesUsb?: Subscription;
  userAllergies?: UserAllergyInterface[];
  currentUserAllergyId?: number;
  currentUserAllergy?: UserAllergyInterface;

  //  Tracking-Values
  displayTrackingValuesDeleteModal: string = 'none';
  displayTrackingValuesCreateModal: string = 'none';
  displayTrackingValuesEditModal: string = 'none';
  trackingValues?: TrackingValueInterface[];
  trackingValuesUsb?: Subscription;
  confirmAddedUserTrackingValue: boolean = false;
  confirmUpdatedUserTrackingValue: boolean = false;
  errorUserTrackingValue?: string = undefined;
  userTrackingValues?: UserTrackingValueInterface[];
  userTrackingValuesUsb?: Subscription;
  currentUserTrackingValue?: UserTrackingValueInterface;
  currentUserTrackingValueId?: number;
  currentTrackingValue?: TrackingValueInterface;
  currentTrackingValueId?: number;

  constructor(
    private profileUserService: ProfileUserService,
    private route: ActivatedRoute,
    private sharedService: SharedService,
    private router: Router,
    private registerDataService: RegisterDataService,
    private cookieService: SsrCookieService
  ) {}

  ngOnInit(): void {
    this.accountId = this.cookieService.get('account_id')!;
    this.userSicknessesUsb = this.profileUserService
      .getAllUserSicknessByAccount(this.accountId)
      .subscribe((response) => {
        this.sicknessesByUser = response;
        console.log(this.sicknessesByUser);
      });

    this.sicknessUsb = this.sharedService
      .getAllSickness()
      .subscribe((response) => {
        this.sicknesses = response;
      });
    this.medicationsUsb = this.sharedService
      .getAllMedication()
      .subscribe((response) => {
        this.medications = response;
      });

    this.userAllergiesUsb = this.profileUserService
      .getUserAllergiesByAccount(this.accountId)
      .subscribe((response) => {
        this.userAllergies = response;
      });

    this.allergiesUsb = this.sharedService
      .getAllAllergy()
      .subscribe((response) => {
        this.allergies = response;
      });

    this.userTrackingValuesUsb = this.profileUserService
      .getUserTrackingValuesByAccount(this.accountId!)
      .subscribe((response) => {
        this.userTrackingValues = response;
      });

    this.trackingValuesUsb = this.sharedService
      .getAllTrackingValues()
      .subscribe((response) => {
        this.trackingValues = response;
      });
  }

  toDashboard() {
    this.router.navigateByUrl(`/perfil-paciente`);
  }

  //Sickness
  handleError?() {
    this.errorAlert = undefined;
  }
  handleErrorMedication?() {
    this.errorAlertMedication = undefined;
  }

  getUserSicknessById(idUserSickness: number): Observable<any> {
    console.log(idUserSickness);
    this.currentUserSicknessId = idUserSickness;
    return this.sharedService
      .getUserSicknessById(this.currentUserSicknessId!.toString())
      .pipe(
        switchMap((userSicknessById) => {
          this.currentUserSickness = userSicknessById;
          return new Observable((observer) => {
            observer.next();
            observer.complete();
          });
        })
      );
  }

  deleteSickness() {
    this.profileUserService
      .deleteUserSickness(
        this.currentUserSicknessId!.toString(),
        this.accountId!
      )
      .subscribe((response) => {
        this.sicknessesByUser = this.sicknessesByUser!.filter(
          (sicknessByUser) =>
            sicknessByUser.userSicknessId !== this.currentUserSicknessId
        );
        this.displayDeleteModal = 'none';
      });
  }

  addPersonalizedSickness() {
    const sicknessData: CreateUserSicknessInterface = {
      accountId: Number(this.accountId),
      sicknessId: this.currentSicknessId!,
    };

    this.sharedService.creteSicknessForUser(sicknessData).subscribe(
      (response) => {
        this.confirmAddedSickness = true;
        this.profileUserService
          .getAllUserSicknessByAccount(this.accountId!)
          .subscribe((sicknesses) => {
            this.sicknessesByUser = sicknesses;
          });
      },
      (errorMessage) => {
        console.log(errorMessage);
        this.errorAlert = errorMessage;
      }
    );
  }
  setCurrentSickness(sickness: SicknessInterface) {
    this.currentSickness = sickness;
    this.currentSicknessId = sickness.sicknessId;
  }

  setCurrentMedicationSickness(medication: MedicationInterface) {
    this.currentMedication = medication;
  }

  addMedication(userSicknessId: number, formData: NgForm) {
    this.currentUserSicknessId = userSicknessId;
    if (!formData.value) {
      return;
    }
    const medicationSicknessData: CreateMedicationSicknessInterface =
      formData.value;
    medicationSicknessData.medicationId = this.currentMedication?.medicationId!;
    medicationSicknessData.userSicknessId = this.currentUserSicknessId!;
    medicationSicknessData.accountId = Number(this.accountId);
    console.log(medicationSicknessData);

    this.profileUserService
      .createMedicationSickness(medicationSicknessData, this.accountId!)
      .subscribe(
        (response) => {
          this.confirmAddMedicine = true;
          this.profileUserService
            .getAllUserSicknessByAccount(this.accountId!)
            .subscribe((sicknessByUser) => {
              this.sicknessesByUser = sicknessByUser;
            });
        },
        (errorMessage) => {
          console.log(errorMessage);
          this.errorAlertMedication = errorMessage;
        }
      );
    formData.reset();
  }

  closeDeleteSicknessModal() {
    this.displayDeleteModal = 'none';
  }
  closeViewModal() {
    this.displayViewModal = 'none';
  }
  closeEditModal() {
    this.displayEditModal = 'none';
  }
  closeCreateModal() {
    this.displayCreateModal = 'none';
  }
  OpenModalCreate() {
    this.currentSickness = undefined;
    this.confirmAddedSickness = false;
    this.errorAlert = undefined;
    this.displayCreateModal = 'block';
  }

  openDeleteModal(idUserSickness: number) {
    this.currentUserSicknessId = idUserSickness;
    this.getUserSicknessById(idUserSickness).subscribe((response) => {
        this.displayDeleteModal = 'block';
      });
  }
  openViewModal(idUserSickness: number) {
    this.currentSicknessId = idUserSickness;
    this.getUserSicknessById(idUserSickness).subscribe((response) => {
      this.displayViewModal = 'block';
    });
  }
  openEditModal(idUserSickness: number) {
    this.confirmAddMedicine = false;
    this.errorAlertMedication = undefined;
    this.currentMedication = undefined;
    this.currentUserSicknessId = idUserSickness;
    this.getUserSicknessById(idUserSickness).subscribe((response) => {
        this.displayEditModal = 'block';
      });
  }
  closeConfirmAddSickness() {
    this.confirmAddedSickness = false;
  }

  // //medication
  goToMedications(medication: MedicationSicknessInterface) {
    console.log(medication);

    this.currentMedicationSickness = medication;
    this.currentMedicationSicknessId = medication.medicationSicknessId;
    this.displayViewModal = 'none';
    this.displayMedicationOptionsModal = 'block';
  }

  openMedicationEdit() {
    this.confirmEditMedicine = false;
    this.displayMedicationOptionsModal = 'none';
    this.displayMedicationEditModal = 'block';
  }

  openMedicationView() {
    this.displayMedicationOptionsModal = 'none';
    this.displayMedicationViewModal = 'block';
  }

  openMedicationDelete() {
    this.displayMedicationOptionsModal = 'none';
    this.displayMedicationDeleteModal = 'block';
  }

  closeDeleteMedicationModal() {
    this.displayMedicationDeleteModal = 'none';
    this.currentMedicationSickness = undefined;
    this.currentMedicationSicknessId = undefined;
  }
  closeViewMedicationModal() {
    this.displayMedicationViewModal = 'none';
    this.currentMedicationSickness = undefined;
    this.currentMedicationSicknessId = undefined;
  }
  closeEditMedicationModal() {
    this.displayMedicationEditModal = 'none';
    this.currentMedicationSickness = undefined;
    this.currentMedicationSicknessId = undefined;
  }
  closeOptionsMedicationModal() {
    this.displayMedicationOptionsModal = 'none';
    this.currentMedicationSickness = undefined;
    this.currentMedicationSicknessId = undefined;
  }

  deleteUserMedication() {
    this.profileUserService
      .deleteMedicationSickness(
        this.currentMedicationSicknessId!.toString(),
        this.accountId!
      )
      .subscribe((response) => {
        this.userSicknessesUsb = this.profileUserService
          .getAllUserSicknessByAccount(this.accountId!)
          .subscribe((response) => {
            this.sicknessesByUser = response;
          });
        this.displayMedicationDeleteModal = 'none';
      });
  }

  updateMedication: (formData: NgForm) => void = (formData) => {
    if (!formData.value) {
      return;
    }
    const updatedData: UpdateMedicationSicknessInterface = formData.value;
    if (formData.value.timeConsumption) {
      updatedData['timeConsumption'] = formData.value.timeConsumption;
    }
    console.log(this.currentMedicationSicknessId);
    this.profileUserService
      .updateMedicationSickness(
        this.currentMedicationSicknessId!.toString(),
        updatedData,
        this.accountId!
      )
      .subscribe((response) => {
        this.confirmEditMedicine = true;
        this.currentMedicationSickness = response;
        this.userSicknessesUsb = this.profileUserService
          .getAllUserSicknessByAccount(this.accountId!)
          .subscribe((response) => {
            this.sicknessesByUser = response;
          });
        this.displayMedicationEditModal = 'none';
      });
    formData.reset();
  };

  closeEditMedicationConfirmation() {
    this.confirmEditMedicine = false;
  }


  closeConfirmAddMedication() {
    this.confirmAddMedicine = false;
  }



  // //Allergies
  handleAllergyError?() {
    this.errorAllergyAlert = undefined;
  }

  getUserAllergyById(idUserAllergy: number): Observable<any> {
    this.currentUserAllergyId = idUserAllergy;
    return this.profileUserService
      .getUserAllergyById(
        this.currentUserAllergyId!.toString(),
        this.accountId!
      )
      .pipe(
        switchMap((userAllergyById) => {
          this.currentUserAllergy = userAllergyById;
          console.log(this.currentUserAllergy);
          return new Observable((observer) => {
            observer.next();
            observer.complete();
          });
        })
      );
  }

  deleteAllergy() {
    this.profileUserService
      .deleteUserAllergy(this.currentUserAllergyId!.toString(), this.accountId!)
      .subscribe((response) => {
        this.userAllergies = this.userAllergies!.filter(
          (userAllergy) =>
            userAllergy.userAllergyId !== this.currentUserAllergyId
        );
        this.displayAllergyDeleteModal = 'none';
      });
  }

  setCurrentAllergy(allergy: AllergyInterface) {
    this.currentAllergy = allergy;
    this.currentAllergyId = allergy.allergyId;
  }
  addAllergy() {
    const userAllergyData: CreateUserAllergyInterface = {
      accountId: Number(this.accountId),
      allergyId: this.currentAllergyId!,
    };

    this.profileUserService
      .createUserAllergy(userAllergyData, this.accountId!)
      .subscribe(
        (response) => {
          this.confirmAddedAllergy = true;
          this.profileUserService
            .getUserAllergiesByAccount(this.accountId!)
            .subscribe((userAllergies) => {
              this.userAllergies = userAllergies;
            });
        },
        (errorMessage) => {
          console.log(errorMessage);
          this.errorAlert = errorMessage;
        }
      );
  }

  closeDeleteAllergyModal() {
    this.displayAllergyDeleteModal = 'none';
  }
  closeAllergyViewModal() {
    this.displayAllergyViewModal = 'none';
  }

  closeAllergyCreateModal() {
    this.displayAllergyCreateModal = 'none';
  }
  OpenAllergyModalCreate() {
    this.confirmAddedAllergy = false;
    this.errorAllergyAlert = undefined;
    this.currentAllergy = undefined;
    this.displayAllergyCreateModal = 'block';
  }

  openAllergyDeleteModal(idUserAllergy: number) {
    this.currentUserAllergyId = idUserAllergy;
    this.getUserAllergyById(idUserAllergy).subscribe(() => {
      this.displayAllergyDeleteModal = 'block';
    });
  }
  openAllergyViewModal(idUserAllergy: number) {
    this.currentUserAllergyId = idUserAllergy;
    console.log(idUserAllergy);

    this.getUserAllergyById(idUserAllergy).subscribe(() => {
      this.displayAllergyViewModal = 'block';
    });
  }
  openAllergyEditModal(idAllergy: number) {
    this.currentUserAllergyId = idAllergy;
    this.getUserAllergyById(idAllergy).subscribe((response) => {
      this.displayAllergyEditModal = 'block';
    });
  }

  // closeConfirmAllergyUpdate() {
  //   this.confirmUpdatedAllergy = false;
  // }

  closeConfirmAddAllergy() {
    this.confirmAddedAllergy = false;
  }

  // Tracking values

  openTrackingValuesEditModal(idUserTrackingValue: number) {
    this.currentUserTrackingValueId = idUserTrackingValue;
    this.sharedService
      .getUserTrackingValueById(this.currentUserTrackingValueId!.toString())
      .subscribe((response) => {
        this.currentUserTrackingValue = response;
        this.displayTrackingValuesEditModal = 'block';
      });
  }

  openTrackingValuesDeleteModal(idUserTrackingValue: number) {
    this.currentUserTrackingValueId = idUserTrackingValue;
    this.sharedService
      .getUserTrackingValueById(this.currentUserTrackingValueId!.toString())
      .subscribe((response) => {
        this.currentUserTrackingValue = response;
        this.displayTrackingValuesDeleteModal = 'block';
      });
  }

  openTrackingValuesModalCreate() {
    this.confirmAddedUserTrackingValue = false;
    this.errorUserTrackingValue = undefined;
    this.displayTrackingValuesCreateModal = 'block';
  }

  closeConfirmAddUserTrackingValue() {
    this.confirmAddedUserTrackingValue = false;
  }
  closeUserTrackingValueCreateModal() {
    this.displayTrackingValuesCreateModal = 'none';
  }
  setCurrentTrackingValue(trackingValue: TrackingValueInterface) {
    this.currentTrackingValue = trackingValue;
    this.currentTrackingValueId = trackingValue.trackingValueId;
  }

  addUserTrackingValue(formData: NgForm) {
    const userTrackingValueData: UserTrackingValueInterface = formData.value;
    userTrackingValueData.accountId = Number(this.accountId);
    userTrackingValueData.trackingValueId = this.currentTrackingValueId!;

    console.log(userTrackingValueData);
    this.profileUserService
      .createUserTrackingValue(userTrackingValueData, this.accountId!)
      .subscribe(
        (response) => {
          this.confirmAddedUserTrackingValue = true;
          this.profileUserService
            .getUserTrackingValuesByAccount(this.accountId!)
            .subscribe((userTrackingValues) => {
              this.userTrackingValues = userTrackingValues;
            });
        },
        (errorMessage) => {
          console.log(errorMessage);
          this.errorUserTrackingValue = errorMessage;
        }
      );
    formData.reset();
  }

  closeDeleteUserTrackingValueModal() {
    this.displayTrackingValuesDeleteModal = 'none';
  }

  deleteUserTrackingValue() {
    this.profileUserService
      .deleteUserTrackingValue(
        this.currentUserTrackingValueId!.toString(),
        this.accountId!
      )
      .subscribe((response) => {
        this.userTrackingValues = this.userTrackingValues!.filter(
          (userTrackingValue) =>
            userTrackingValue.userTrackingValueId !==
            this.currentUserTrackingValueId
        );
        this.displayTrackingValuesDeleteModal = 'none';
      });
  }

  updateUserTrackingValue(formData: NgForm) {
    if (!formData.value) {
      return;
    }
    const updatedData: UserTrackingValueInterface = formData.value;
    this.profileUserService
      .updateUserTrackingValue(
        this.currentUserTrackingValueId!.toString(),
        updatedData,
        this.accountId!
      )
      .subscribe((response) => {
        this.confirmUpdatedUserTrackingValue = true;
        this.currentUserTrackingValue = response;
        this.profileUserService
          .getUserTrackingValuesByAccount(this.accountId!)
          .subscribe((response) => {
            this.userTrackingValues = response;
          });
        this.displayTrackingValuesEditModal = 'none';
      });
    formData.reset();
  }
  ngOnDestroy(): void {
    if (this.sicknessUsb) {
      this.sicknessUsb.unsubscribe();
    }
    if (this.allergiesUsb) {
      this.allergiesUsb.unsubscribe();
    }
    if (this.trackingValuesUsb) {
      this.trackingValuesUsb.unsubscribe();
    }
    if (this.userSicknessesUsb) {
      this.userSicknessesUsb.unsubscribe();
    }
    if (this.medicationsUsb) {
      this.medicationsUsb.unsubscribe();
    }
    if (this.userAllergiesUsb) {
      this.userAllergiesUsb.unsubscribe();
    }
    if (this.userTrackingValuesUsb) {
      this.userTrackingValuesUsb.unsubscribe();
    }

    if(this.accountId){
      this.registerDataService.updateRegisterDataAccount(this.accountId!).subscribe();
    }

  }
}
