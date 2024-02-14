import { Component, OnDestroy, OnInit } from '@angular/core';
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
import { WindowService } from '../../shared/window.service';

@Component({
  selector: 'app-register-data',
  templateUrl: './register-data.component.html',
  styleUrls: ['./register-data.component.css'],
})
export class RegisterDataComponent implements OnInit , OnDestroy {
  accountId?: string;

  // medication
  currentMedicationSicknesses?: MedicationSicknessInterface[];
  medications?: MedicationInterface[];
  medicationsUsb?: Subscription;
  currentMedication?: MedicationInterface;
  displayErrorCreateMedication: boolean = false;
  confirmAddMedicine: boolean = false;
  errorAddMedication?: string = undefined;
  displayViewMedicationModal: string = 'none';
  displayCreateMedicationModal: string = 'none';

  // sickness
  sicknesses?: SicknessInterface[];
  sicknessesUsb?: Subscription;
  currentSickness?: SicknessInterface;
  currentSicknessId?: number;
  userSicknesses?: UserSicknessInterface[];
  userSicknessesUsb?: Subscription;
  currentUserSickness?: UserSicknessInterface;
  displayDeleteModal: string = 'none';
  displayCreateModal: string = 'none';
  confirmAddedSickness: boolean = false;
  errorCreate?: string = undefined;
  displayErrorCreate: boolean = false;

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
  errorAllergy: string = '';

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
  displayErrorUserTrackingValue: boolean = false;
  displayErrorUpdateUserTrackingValue: boolean = false;
  confirmUpdateUserTrackingValue: boolean = false;
  errorUpdateTrackingValue: string = '';

  isMobile: boolean = false;
  private windowSub?: Subscription;

  constructor(
    private profileUserService: ProfileUserService,
    private route: ActivatedRoute,
    private sharedService: SharedService,
    private router: Router,
    private registerDataService: RegisterDataService,
    private cookieService: SsrCookieService,
    private windowService: WindowService
  ) {}

  ngOnInit(): void {
    this.accountId = this.cookieService.get('account_id')!;
    this.userSicknessesUsb = this.profileUserService
      .getAllUserSicknessByAccount(this.accountId)
      .subscribe((response) => {
        this.userSicknesses = response;
      });

    this.sicknessesUsb = this.sharedService
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

  getAccountId() {
    return this.cookieService.get('account_id');
  }

  toDashboard() {
    this.registerDataService.updateRegisterDataAccount(this.accountId!).subscribe();
    this.router.navigateByUrl(`/perfil-paciente`);
  }

  // delete sickness

  openDeleteModal(userSickness: UserSicknessInterface) {
    this.currentUserSickness = userSickness;
    this.displayDeleteModal = 'block';
  }

  deleteSickness() {
    this.profileUserService
      .deleteUserSickness(
        this.currentUserSickness!.userSicknessId.toString(),
        this.getAccountId()
      )
      .subscribe((response) => {
        this.userSicknesses! = this.userSicknesses!.filter(
          (userSickness) =>
            userSickness.userSicknessId !==
            this.currentUserSickness!.userSicknessId
        );
        this.currentUserSickness = undefined;
        this.displayDeleteModal = 'none';
      });
  }

  closeDeleteSicknessModal() {
    this.currentUserSickness = undefined;
    this.displayDeleteModal = 'none';
  }

  // add sickness

  setCurrentSickness(sickness: SicknessInterface) {
    this.currentSickness = sickness;
    this.currentSicknessId = sickness.sicknessId;
  }

  openCreateModal() {
    this.displayCreateModal = 'block';
  }

  addSickness(form: NgForm) {
    const sicknessData: CreateUserSicknessInterface = form.value;
    sicknessData.accountId = parseInt(this.getAccountId());
    if (this.currentSickness) {
      sicknessData.sicknessId = this.currentSickness!.sicknessId;
    }

    this.profileUserService
      .createUserSickness(sicknessData, this.getAccountId())
      .subscribe(
        (response) => {
          this.userSicknesses?.push(response);
          this.currentSickness = undefined;
          this.currentSicknessId = undefined;
          this.confirmAddedSickness = true;
          this.errorCreate = undefined;
        },
        (errorMessage) => {
          this.errorCreate = errorMessage;
          this.displayErrorCreate = true;
          this.errorCreate = errorMessage;
          this.confirmAddedSickness = false;
        }
      );
    form.reset();
  }

  closeCreateModal() {
    this.currentSickness = undefined;
    this.displayCreateModal = 'none';
    this.confirmAddedSickness = false;
    this.displayErrorCreate = false;
    this.errorCreate = '';
  }

  closeConfirmCreate() {
    this.confirmAddedSickness = false;
  }

  closeErrorCreate() {
    this.displayErrorCreate = false;
  }




// medication
  openViewMedicineModal(userSickness: UserSicknessInterface) {
    this.currentUserSickness = userSickness;
    this.currentMedicationSicknesses = userSickness.medicationSicknesses;
    this.displayViewMedicationModal = 'block';
  }


  //add  medication
  setCurrentMedication(medication: MedicationInterface) {
    this.currentMedication = medication;
  }

  openModalCreateMedication() {
    this.displayCreateMedicationModal = 'block';
    this.displayErrorCreateMedication = false;
    this.errorAddMedication = undefined;
    this.confirmAddMedicine = false;
  }
  closeCreateModalMedication() {
    this.displayCreateMedicationModal = 'none';
    this.currentMedication = undefined;
  }

  AddMedication(form: NgForm) {
    const medicationData: CreateMedicationSicknessInterface = form.value;
    medicationData.accountId = parseInt(this.getAccountId());
    if (this.currentMedication) {
      medicationData.medicationId = this.currentMedication!.medicationId;
    }
    medicationData.userSicknessId = this.currentUserSickness!.userSicknessId;

    this.profileUserService
      .createMedicationSickness(medicationData, this.getAccountId())
      .subscribe(
        (response) => {
          this.currentMedicationSicknesses!.push(response);
          this.currentMedication = undefined;
          this.confirmAddMedicine = true;
          this.displayErrorCreateMedication = false;
          this.ngOnInit();
        },
        (errorMessage) => {
          this.displayErrorCreateMedication = true;
          this.confirmAddMedicine = false;
          this.errorAddMedication = errorMessage;
        }
      );
    form.reset();
  }

  closeConfirmAddMedication() {
    this.confirmAddMedicine = false;
  }
  closeConfirmErrorMedication() {
    this.displayErrorCreateMedication = false;
  }

  // delete medication

  deleteMedication(medicationSicknessId: number) {
    this.profileUserService
      .deleteMedicationSickness(
        medicationSicknessId.toString(),
        this.getAccountId()
      )
      .subscribe(
        (response) => {
          this.currentMedicationSicknesses =
            this.currentMedicationSicknesses!.filter(
              (medicationSickness) =>
                medicationSickness.medicationSicknessId !== medicationSicknessId
            );
          this.ngOnInit();
        }
      );
  }

  closeViewMedicationModal() {
    this.displayViewMedicationModal = 'none';
  }
  //Allergies
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
          this.errorAllergy = errorMessage;
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

  //Edit

  openTrackingValuesEditModal(idUserTrackingValue: number) {
    this.currentUserTrackingValueId = idUserTrackingValue;
    this.sharedService
      .getUserTrackingValueById(this.currentUserTrackingValueId!.toString())
      .subscribe((response) => {
        this.currentUserTrackingValue = response;
        this.displayTrackingValuesEditModal = 'block';
      });
  }

  updateUserTrackingValue(formData: NgForm) {
    const updatedData: UserTrackingValueInterface = formData.value;
    this.profileUserService
      .updateUserTrackingValue(
        this.currentUserTrackingValueId!.toString(),
        updatedData,
        this.accountId!
      )
      .subscribe((response) => {
        this.confirmUpdateUserTrackingValue = true;
        this.currentUserTrackingValue = response;
        this.profileUserService
          .getUserTrackingValuesByAccount(this.accountId!)
          .subscribe((response) => {
            this.userTrackingValues = response;
          });
      },
      (errorMessage) => {
        console.log(errorMessage);
        this.errorUserTrackingValue = errorMessage;
        this.displayErrorUserTrackingValue = true;
      });
  }

  closeErrorUpdateUserTrackingValue() {
    this.displayErrorUpdateUserTrackingValue = false;
  }

  closeConfirmUpdateUserTrackingValue() {
    this.confirmUpdateUserTrackingValue = false;
  }

  closeUpdateUserTrackingValueModal() {
    this.displayTrackingValuesEditModal = 'none';
  }

  //Create

  openTrackingValuesModalCreate() {
    this.confirmAddedUserTrackingValue = false;
    this.errorUserTrackingValue = undefined;
    this.displayTrackingValuesCreateModal = 'block';
  }

  closeErrorUserTrackingValue() {
    this.displayErrorUserTrackingValue = false;
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
          this.displayErrorUserTrackingValue = true;
        }
      );
    formData.reset();
  }

  //Delete

  openTrackingValuesDeleteModal(idUserTrackingValue: number) {
    this.currentUserTrackingValueId = idUserTrackingValue;
    this.sharedService
      .getUserTrackingValueById(this.currentUserTrackingValueId!.toString())
      .subscribe((response) => {
        this.currentUserTrackingValue = response;
        this.displayTrackingValuesDeleteModal = 'block';
      });
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


  ngOnDestroy(): void {
    if (this.sicknessesUsb) {
      this.sicknessesUsb.unsubscribe();
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

  }
}
