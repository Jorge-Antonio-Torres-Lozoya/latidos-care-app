import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Observable, Subject, Subscription, switchMap } from 'rxjs';
import { NgForm } from '@angular/forms';
import { Color, ScaleType, LegendPosition } from '@swimlane/ngx-charts';
import { MedicationInterface } from '../../shared/interfaces/medication.interface';
import { ProfileUserService } from '../profile-user/profile-user.service';
import { SearchCurrentValuesInterface } from '../../shared/interfaces/search-current-values.interface';
import { formatDateHelper } from '../../shared/helpers/helperFunctions';
import { SicknessInterface } from '../../shared/interfaces/sickness.interface';
import { AllergyInterface } from '../../shared/interfaces/allergy.interface';
import { TrackingValueInterface } from '../../shared/interfaces/tracking-value.interface';
import { CreateSicknessInterface } from '../profile-admin/interfaces/create-sickness.interface';
import { UpdateSicknessInterface } from '../../shared/interfaces/update-sickness.interface';
import { CreateMedicationInterface } from '../profile-admin/interfaces/create-medication.interface';
import { UpdateAllergyInterface } from '../../shared/interfaces/update-allergy.interface';
import { CreateTrackingValueInterface } from '../profile-admin/interfaces/create-tracking-value.interface';
import { UpdateTrackingValueInterface } from '../../shared/interfaces/update-tracking-value.interface';
import { UpdateMedicationInterface } from '../../shared/interfaces/update-medication.interface';
import { TreatmentInterface } from '../../shared/interfaces/treatment.interface';
import { CreateUserSicknessInterface } from '../../shared/interfaces/create-user-sickness.interface';
import { MedicationSicknessInterface } from '../../shared/interfaces/medication-sickness.interface';
import { UserSicknessInterface } from '../../shared/interfaces/user-sickness.interface';
import { UserAllergyInterface } from '../../shared/interfaces/user-allergy.interface';
import { UserTrackingValueInterface } from '../../shared/interfaces/user-tracking-value.interface';
import { RegisterDataService } from '../register-data/register-data.service';
import { SsrCookieService } from 'ngx-cookie-service-ssr';
import { SharedService } from '../../shared/shared.service';
import { CreateMedicationSicknessInterface } from '../../shared/interfaces/create-medication-sickness.interface';
import { UpdateMedicationSicknessInterface } from '../../shared/interfaces/update-medication-sickness.interface';
import { CreateUserAllergyInterface } from '../../shared/interfaces/create-user-allergy.interface';
import { AccountInterface } from '../../shared/interfaces/account.interface';
import { UpdateUserTrackingValueInterface } from '../../shared/interfaces/update-user-trackin-value.interface';

@Component({
  selector: 'app-data-pacient',
  templateUrl: './data-pacient.component.html',
  styleUrls: ['./data-pacient.component.css']
})
export class DataPacientComponent implements OnInit, OnDestroy {
  token = this.route.snapshot.queryParamMap.get('token')
  accountId?: string;
  slug: string = this.route.snapshot.paramMap.get('slug')!;
  account?: AccountInterface;
  private accountUsb?:Subscription;

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
  showErrorCreateAllergy: boolean = false;

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
    private cookieService: SsrCookieService
  ) {}

  ngOnInit(): void {
    this.accountUsb = this.sharedService.getAccountBySlug(this.slug).subscribe(account => {
      this.account = account;
      this.accountId = account.accountId.toString();

      this.userSicknessesUsb = this.profileUserService
      .getAllUserSicknessByAccount(this.accountId, this.token!)
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
      .getUserAllergiesByAccount(this.accountId, this.token!)
      .subscribe((response) => {
        this.userAllergies = response;
      });

    this.allergiesUsb = this.sharedService
      .getAllAllergy()
      .subscribe((response) => {
        this.allergies = response;
      });

    this.userTrackingValuesUsb = this.profileUserService
      .getUserTrackingValuesByAccount(this.accountId!, this.token!)
      .subscribe((response) => {
        this.userTrackingValues = response;
      });

    this.trackingValuesUsb = this.sharedService
      .getAllTrackingValues()
      .subscribe((response) => {
        this.trackingValues = response;
      });
    })
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
      this.accountId!, this.token!
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
  sicknessData.accountId = parseInt(this.accountId!);
  if (this.currentSickness) {
    sicknessData.sicknessId = this.currentSickness!.sicknessId;
  }

  this.profileUserService
    .createUserSickness(sicknessData, this.accountId!, this.token!)
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
  medicationData.accountId = parseInt(this.accountId!);
  if (this.currentMedication) {
    medicationData.medicationId = this.currentMedication!.medicationId;
  }
  medicationData.userSicknessId = this.currentUserSickness!.userSicknessId;

  this.profileUserService
    .createMedicationSickness(medicationData, this.accountId!, this.token!)
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
      this.accountId!, this.token!
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


getUserAllergyById(idUserAllergy: number): Observable<any> {
  this.currentUserAllergyId = idUserAllergy;
  return this.profileUserService
    .getUserAllergyById(
      this.currentUserAllergyId!.toString(),
      this.accountId!, this.token!
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
    .createUserAllergy(userAllergyData, this.accountId!, this.token!)
    .subscribe(
      (response) => {
        this.confirmAddedAllergy = true;
        this.profileUserService
          .getUserAllergiesByAccount(this.accountId!, this.token!)
          .subscribe((userAllergies) => {
            this.userAllergies = userAllergies;
          });
      },
      (errorMessage) => {
        console.log(errorMessage);
        this.errorAllergy = errorMessage;
        this.showErrorCreateAllergy = true;
      }
    );
}

closeErrorCreateAllergy() {
  this.showErrorCreateAllergy = false;
}

closeAllergyViewModal() {
  this.displayAllergyViewModal = 'none';
}

closeAllergyCreateModal() {
  this.displayAllergyCreateModal = 'none';
  this.confirmAddedAllergy = false;
  this.errorAllergyAlert = undefined;
  this.currentAllergy = undefined;
  this.showErrorCreateAllergy = false;
}

openAllergyModalCreate() {
  this.displayAllergyCreateModal = 'block';
}

deleteAllergy() {
  this.profileUserService
    .deleteUserAllergy(this.currentUserAllergyId!.toString(), this.accountId!, this.token!)
    .subscribe((response) => {
      this.userAllergies = this.userAllergies!.filter(
        (userAllergy) =>
          userAllergy.userAllergyId !== this.currentUserAllergyId
      );
      this.displayAllergyDeleteModal = 'none';
    });
}

closeDeleteAllergyModal() {
  this.displayAllergyDeleteModal = 'none';
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
  const updatedData: UpdateUserTrackingValueInterface = formData.value;
  this.profileUserService
    .updateUserTrackingValue(
      this.currentUserTrackingValueId!.toString(),
      updatedData,
      this.accountId!, this.token!
    )
    .subscribe((response) => {
      this.confirmUpdateUserTrackingValue = true;
      this.currentUserTrackingValue = response;
      this.profileUserService
        .getUserTrackingValuesByAccount(this.accountId!, this.token!)
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
    .createUserTrackingValue(userTrackingValueData, this.accountId!, this.token!)
    .subscribe(
      (response) => {
        this.confirmAddedUserTrackingValue = true;
        this.profileUserService
          .getUserTrackingValuesByAccount(this.accountId!, this.token!)
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
      this.accountId!, this.token!
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

    if (this.accountUsb) {
      this.accountUsb.unsubscribe();
    }
  }
}

  // parte que ya estaba

  // token = this.route.snapshot.queryParamMap.get('token')
  // errorCurrentValue?:string;
  // errorTreatment?:string;
  // displayConfirmation: string = 'none';
  // isLoadingValues:boolean = true;
  // valuesDisplays:boolean = false;
  // valuesEmpty:boolean = false;
  // treatmentsDisplay:boolean = false;
  // isLoadingTreatments:boolean = true;
  // treatmentsEmpty:boolean = false;
  // id = this.route.snapshot.paramMap.get('userId');
  // sicknesses?: SicknessInterface[];
  // sicknessUsb?: Subscription;
  // allergies?: AllergyInterface[]
  // allergiesUsb?:Subscription
  // trackingValues?: TrackingValueInterface[];
  // trackingValuesUsb?: Subscription;
  // // currentValues?:CurrentValues[];
  // currentValuesUsb?:Subscription;
  // treatments?:any[];
  // treatmentsUsb?:Subscription;
  // timeFrameOfTreatment?:string;
  // // options currentValues
  // legend: boolean = true;
  // multi?: any[]
  // showLabels: boolean = true;
  // animations: boolean = true;
  // xAxis: boolean = true;
  // yAxis: boolean = true;
  // showYAxisLabel: boolean = true;
  // showXAxisLabel: boolean = true;
  // xAxisLabel: string = 'Fechas';
  // yAxisLabel: string = 'Nivel';
  // timeline: boolean = true;
  // colorScheme: Color = { domain: ['#99CCE5', '#FF7F7F'], group: ScaleType.Ordinal, selectable: true, name: 'Customer Usage', };

  // // options currentValues
  // single?: any[];
  // gradient: boolean = true;
  // showLegend: boolean = true;
  // //showLabelsTreatment: boolean = true;
  // isDoughnut: boolean = false;
  // legendPosition: LegendPosition = LegendPosition.Right;
  // colorSchemeTreatment: Color = { domain: ['#99CCE5', '#FF7F7F'], group: ScaleType.Ordinal, selectable: true, name: 'Customer Usage', };
  // private destroy$ = new Subject<void>();
  // timer: any;
  // minutes: number = 15;
  // seconds: number = 0;

  // //medications
  // medications?:MedicationInterface[];
  // currentMedication?:MedicationInterface;
  // currentMedicationId?:string;
  // displayMedicationOptionsModal:string = 'none';
  // displayMedicationViewModal:string = 'none';
  // displayMedicationEditModal:string = 'none';
  // displayMedicationDeleteModal:string = 'none';
  // confirmEditMedicine:boolean = false;

  // //sickness
  // sicknessById?: SicknessInterface
  // displayDeleteModal: string = 'none';
  // displayCreateModal: string = 'none';
  // displayViewModal: string = 'none';
  // displayEditModal: string = 'none';
  // currentSicknessId?: number;
  // currentSickness?: SicknessInterface;
  // confirmAddedSickness:boolean = false;
  // confirmUpdatedSickness:boolean = false;
  // confirmUpdatedCurrentValue:boolean = false;
  // confirmAddMedicine:boolean = false;
  // errorAlertMedication?: string = undefined;
  // errorAlert?: string = undefined;

  // //allergies
  // allergyById?: AllergyInterface
  // displayAllergyDeleteModal: string = 'none';
  // displayAllergyCreateModal: string = 'none';
  // displayAllergyViewModal: string = 'none';
  // displayAllergyEditModal: string = 'none';
  // currentAllergyId?: number;
  // currentAllergy?: AllergyInterface;
  // confirmAddedAllergy:boolean = false;
  // confirmUpdatedAllergy:boolean = false;
  // errorAllergyAlert?: string = undefined;

  // //tracking values
  // trackingValueById?: TrackingValueInterface
  // displayTrackingDeleteModal: string = 'none';
  // displayTrackingCreateModal: string = 'none';
  // displayTrackingViewModal: string = 'none';
  // displayTrackingEditModal: string = 'none';
  // displayTrackingAlertsModal: string = 'none';
  // currentTrackingValueId?: number;
  // currentTrackingValue?: TrackingValueInterface;
  // confirmAddedTrackingValue:boolean = false;
  // confirmUpdatedTrackingValue:boolean = false;
  // confirmTrackingUpdatedCurrentValue:boolean = false;
  // confirmAddCurrentValue:boolean = false;
  // confirmUpdatedTrackingAlerts: boolean = false;
  // errorAlertCurrentValue?: string = undefined;
  // errorTrackingAlert?: string = undefined;


  // ngOnInit(): void {
    /*this.profileUserService.validateVerificationTokenUser(this.id!, this.token!).subscribe((response) => {
      if(response.validated === false) {
        this.router.navigate(['unauthorized']);
      }

    })*/
    // this.sicknessUsb = this.profileUserService.getAllSicknessByUser(this.id!, this.token!).subscribe((response) => {
    //   this.sicknesses = response;
    // });
    // this.allergiesUsb = this.profileUserService.getAllergiesByUser(this.id!, this.token!).subscribe((response) => {
    //   this.allergies = response;
    // });
    // this.trackingValuesUsb = this.profileUserService.getTrackingValuesByUser(this.id!, this.token!).subscribe((response) => {
    //   this.trackingValues = response;
    // });
    // 15 minutes timer
  //   setTimeout(() => {
  //     this.router.navigate(['time-out']);
  //   }, 15 * 60 * 1000);
  //   this.startTimer();
  // }

  // setCurrentMedication(medication:MedicationInterface) {
  //   this.currentMedication = medication;
  //   this.currentMedicationId = medication.medicationId!.toString();
  // }

  // searchCurrentValue(form:NgForm) {
  //   this.valuesEmpty = false;
  //   this.valuesDisplays = true;
  //   let searchValues:SearchCurrentValuesInterface = form.value
  //   const startDate: Date = new Date(searchValues.startYear, searchValues.startMonth - 1, searchValues.startDay);
  //   const endDate: Date = new Date(searchValues.endYear, searchValues.endMonth - 1, searchValues.endDay);
  //   const startDateString:string = startDate.toISOString();
  //   const endDateString:string = endDate.toISOString();
  //   console.log(startDateString);
  //   console.log(endDateString);
  //   this.currentValuesUsb = this.profileUserService.getCurrentValueByDate(this.id!, startDateString, endDateString, this.token!).subscribe((response) => {
  //     if(response.length > 0) {
  //       // this.currentValues = response;
  //       this.multi = this.transformDataValues(response)
  //       console.log(this.multi);
  //       this.isLoadingValues = false;
  //     } else {
  //       this.valuesDisplays = false;
  //       this.isLoadingValues = false;
  //       this.valuesEmpty = true;
  //     }
  //   }, errorMessage => {
  //     console.log(errorMessage);
  //     this.errorCurrentValue = errorMessage;
  //   })
  //   form.reset();
  // }

  // searchTreatmentsByMedication(form:NgForm) {
  //   this.treatmentsEmpty = false;
  //   this.treatmentsDisplay = true;
  //   let searchTreatment:SearchCurrentValuesInterface = form.value;
  //   const startDate:Date = new Date(searchTreatment.startYear, searchTreatment.startMonth -1, searchTreatment.startDay);
  //   const endDate:Date = new Date(searchTreatment.endYear, searchTreatment.endMonth -1, searchTreatment.endDay);
  //   const startDateString:string = startDate.toISOString();
  //   const endDateString:string = endDate.toISOString();
  //   if(this.currentMedicationId) {
  //     console.log(this.currentMedicationId);
  //     this.treatmentsUsb = this.profileUserService.getTreatmentsByDate(this.currentMedicationId!, startDateString, endDateString, this.token!)
  //     .subscribe((response) => {
  //       if(response.length > 0) {
  //         this.treatments = response;
  //         this.single = this.transformDataTreatment(response);
  //         this.timeFrameOfTreatment = `Este gráfico representa la cantidad de veces que el usuario a tomado su
  //         medicina desde ${startDate} al ${endDate}`
  //         this.isLoadingTreatments = false;
  //       } else {
  //         this.treatmentsDisplay = false;
  //         this.isLoadingTreatments = false;
  //         this.treatmentsEmpty = true;
  //       }
  //     }, errorMessage => {
  //       console.log(errorMessage);
  //       this.errorTreatment = errorMessage;
  //     })
  //   }
  //   form.reset();
  // }

  // handleErrorCurrentValue() {
  //   this.errorCurrentValue = undefined;
  // }

  // handleErrorTreatment() {
  //   this.errorTreatment = undefined;
  // }

  // transformDataValues(data: any[]): any[] {
  //   // Group data by sicknessName
  //   const groupedData: { [key: string]: any[] } = {};
  //   data.forEach(item => {
  //     const trackingValueName = item.trackingValue.trackingValueName;
  //     if (!groupedData[trackingValueName]) {
  //       groupedData[trackingValueName] = [];
  //     }
  //     groupedData[trackingValueName].push({
  //       name: formatDateHelper(item.createdAt),
  //       value: item.currentNumber
  //     });
  //   });

  //   // Convert to the required format
  //   const transformedData = Object.keys(groupedData).map(trackingValueName => ({
  //     name: trackingValueName,
  //     series: groupedData[trackingValueName]
  //   }));

  //   return transformedData;
  // }

  // transformDataTreatment(data: TreatmentInterface[]): any[] {
  //   let takenCount = 0;
  //   let notTakenCount = 0;

  //   data.forEach(item => {
  //     if (item.taken) {
  //       takenCount++;
  //     } else {
  //       notTakenCount++;
  //     }
  //   });
  //   return [
  //     { name: 'Tomó medicina', value: takenCount },
  //     { name: 'No tomó medicina', value: notTakenCount }
  //   ];
  // }

  // startTimer() {
  //   this.timer = setInterval(() => {
  //     if (this.seconds === 0) {
  //       if (this.minutes === 0) {
  //         clearInterval(this.timer);
  //         this.router.navigate(['/time-out']);
  //         return;
  //       } else {
  //         this.minutes--;
  //         this.seconds = 59;
  //       }
  //     } else {
  //       this.seconds--;
  //     }
  //   }, 1000);
  // }

  // get displayTime() {
  //   const min = String(this.minutes).padStart(2, '0');
  //   const sec = String(this.seconds).padStart(2, '0');
  //   return `${min}:${sec}`;
  // }


  // //Sickness
  // handleError?() {
  //   this.errorAlert = undefined;
  // }
  // handleErrorMedication?() {
  //   this.errorAlertMedication = undefined;
  // }

  // getSicknessById(idSickness: number): Observable<any> {
  //   this.currentSicknessId = idSickness;
  //   return this.profileUserService
  //     .getSicknessById(this.currentSicknessId!.toString(), this.token!)
  //     .pipe(
  //       switchMap((sicknessById) => {
  //         this.sicknessById = sicknessById;
  //         console.log(sicknessById.medications);
  //         return new Observable((observer) => {
  //           observer.next();
  //           observer.complete();
  //         });
  //       })
  //     );
  // }

  // deleteSickness() {
  //   this.profileUserService
  //     .deleteSickness(this.currentSicknessId!.toString(), this.token!)
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
  //   sicknessData.userId = Number(this.id!);
  //   this.profileUserService.createSickness(sicknessData, this.token!).subscribe(
  //     (response) => {
  //       this.confirmAddedSickness = true;
  //       this.profileUserService
  //         .getAllSicknessByUser(this.id!, this.token!)
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
  //     .editSickness(updatedData, this.currentSicknessId!.toString(), this.token!)
  //     .subscribe((response) => {
  //       this.confirmUpdatedSickness = true;
  //       this.profileUserService
  //       .getAllSicknessByUser(this.id!, this.token!)
  //       .subscribe((sicknesses) => {
  //         this.sicknesses = sicknesses;
  //         this.profileUserService.getSicknessById(this.currentSicknessId!.toString(), this.token!).subscribe((response)=>{
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
  //   medicationData.userId = Number(this.id!);
  //   this.profileUserService.createMedication(medicationData, this.token!).subscribe(
  //     (response) => {
  //       this.confirmAddMedicine = true;
  //       this.profileUserService
  //         .getAllSicknessByUser(this.id!, this.token!)
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
  //     .deleteMedication(this.currentMedicationId!.toString(), this.token!)
  //     .subscribe((response) => {
  //       this.sicknessUsb = this.profileUserService.getAllSicknessByUser(this.id!, this.token!).subscribe((response) => {
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
  //     .updateMedication(updatedData, this.currentMedicationId!.toString(), this.token!)
  //     .subscribe((response) => {
  //       this.confirmEditMedicine = true;
  //       this.currentMedication = response;
  //       this.sicknessUsb = this.profileUserService.getAllSicknessByUser(this.id!, this.token!).subscribe((response) => {
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
  //   this.profileUserService.getSicknessById(idSickness.toString(), this.token!).subscribe((response)=>{
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
  //     .getAllergyById(this.currentAllergyId!.toString(), this.token!)
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
  //     .deleteAllergy(this.currentAllergyId!.toString(), this.token!)
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
  //   allergyData.userId = Number(this.id!);
  //   this.profileUserService.createAllergy(allergyData, this.token!).subscribe(
  //     (response) => {
  //       this.confirmAddedAllergy = true;
  //       this.profileUserService
  //         .getAllergiesByUser(this.id!, this.token!)
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
  //     .updateAllergy(updatedData, this.currentAllergyId!.toString(), this.token!)
  //     .subscribe((response) => {
  //       this.confirmUpdatedAllergy = true;
  //       this.profileUserService
  //       .getAllergiesByUser(this.id!, this.token!)
  //       .subscribe((allergies) => {
  //         this.allergies = allergies;
  //         this.profileUserService.getAllergyById(this.currentAllergyId!.toString(), this.token!).subscribe((response)=>{
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
  //   this.profileUserService.getAllergyById(idAllergy.toString(), this.token!).subscribe((response)=>{
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

  // //Tracking Values

  // handleTrackingError?() {
  //   this.errorTrackingAlert = undefined;
  // }
  // handleTrackingErrorCurrentValue?() {
  //   this.errorAlertCurrentValue = undefined;
  // }

  // getTrackingValueById(idTrackingValue: number): Observable<any> {
  //   this.currentTrackingValueId = idTrackingValue;
  //   return this.profileUserService
  //     .getTrackingValueById(this.currentTrackingValueId!.toString(), this.token!)
  //     .pipe(
  //       switchMap((trackingValueById) => {
  //         this.trackingValueById = trackingValueById;
  //         return new Observable((observer) => {
  //           observer.next();
  //           observer.complete();
  //         });
  //       })
  //     );
  // }

  // deleteTrackingValue() {
  //   this.profileUserService
  //     .deleteTrackingValue(this.currentTrackingValueId!.toString(), this.token!)
  //     .subscribe((response) => {
  //       this.trackingValues = this.trackingValues!.filter(
  //         (trackingValue) =>
  //         trackingValue.trackingValueId !== this.currentTrackingValueId
  //       );
  //       this.displayTrackingDeleteModal = 'none';
  //     });
  // }

  // addTrackingValue(form: NgForm) {
  //   const trackingValueData: CreateTrackingValueInterface = form.value;
  //   trackingValueData.userId = Number(this.id!);
  //   this.profileUserService.createTrackingValue(trackingValueData, this.token!).subscribe(
  //     (response) => {
  //       this.confirmAddedTrackingValue = true;
  //       this.profileUserService
  //         .getTrackingValuesByUser(this.id!, this.token!)
  //         .subscribe((trackingValues) => {
  //           this.trackingValues = trackingValues;
  //         });
  //     },
  //     (errorMessage) => {
  //       console.log(errorMessage);
  //       this.errorAlert = errorMessage;
  //     }
  //   );
  //   form.reset();
  // }
  // updateTrackingValue: ( formData: NgForm) => void = (
  //   formData
  // ) => {
  //   if (!formData.value) {
  //     return;
  //   }
  //   const updatedData: UpdateTrackingValueInterface = {};
  //   if (formData.value.trackingValueName) {
  //     updatedData['trackingValueName'] = formData.value.trackingValueName;
  //   }
  //   if (formData.value.minLimit) {
  //     updatedData['minLimit'] = Number(formData.value.minLimit);
  //   }
  //   if (formData.value.maxLimit) {
  //     updatedData['maxLimit'] = Number(formData.value.maxLimit);
  //   }
  //   this.profileUserService
  //     .updateTrackingValue(updatedData, this.currentTrackingValueId!.toString(), this.token!)
  //     .subscribe((response) => {
  //       this.confirmUpdatedTrackingValue = true;
  //       this.profileUserService
  //       .getTrackingValuesByUser(this.id!, this.token!)
  //       .subscribe((trackingValues) => {
  //         this.trackingValues = trackingValues;
  //         this.profileUserService.getTrackingValueById(this.currentTrackingValueId!.toString(), this.token!).subscribe((response)=>{
  //           this.currentTrackingValue = response;
  //         });
  //       });
  //     });
  // };

  // updateTrackingAlertsMessages(formData: NgForm) {
  //   if (!formData.value) {
  //     return;
  //   }
  //   const updatedData: UpdateTrackingAlertsInterface = {};
  //   if (formData.value.personalizedAlertMinValue) {
  //     updatedData['personalizedAlertMinValue'] = formData.value.personalizedAlertMinValue;
  //   }
  //   if (formData.value.personalizedAlertMaxValue) {
  //     updatedData['personalizedAlertMaxValue'] = formData.value.personalizedAlertMaxValue;
  //   }
  //   updatedData['userId'] = parseInt(this.id!);
  //   this.profileUserService
  //     .updateTrackingAlerts(updatedData, this.currentTrackingValueId!.toString(), this.token!)
  //     .subscribe((response) => {
  //       this.confirmUpdatedTrackingAlerts = true;
  //       this.profileUserService
  //       .getTrackingValuesByUser(this.id!, this.token!)
  //       .subscribe((trackingValues) => {
  //         this.trackingValues = trackingValues;
  //         this.profileUserService.getTrackingValueById(this.currentTrackingValueId!.toString(), this.token!).subscribe((response)=>{
  //           this.currentTrackingValue = response;
  //         });
  //       });
  //     });
  //     formData.reset();
  // };

  // updateTrackingAlerts() {
  //   const updatedData: UpdateTrackingAlertsInterface = {};
  //   if (this.currentTrackingValue?.alertActivated === true) {
  //     updatedData['alertActivated'] = false;
  //   } else {
  //     updatedData['alertActivated'] = true;
  //   }
  //   updatedData['userId'] = parseInt(this.id!);
  //   this.profileUserService
  //     .updateTrackingAlerts(updatedData, this.currentTrackingValueId!.toString(), this.token!)
  //     .subscribe((response) => {
  //       this.profileUserService
  //       .getTrackingValuesByUser(this.id!, this.token!)
  //       .subscribe((trackingValues) => {
  //         this.trackingValues = trackingValues;
  //         this.profileUserService.getTrackingValueById(this.currentTrackingValueId!.toString(), this.token!).subscribe((response)=>{
  //           this.currentTrackingValue = response;
  //         });
  //       });
  //     });
  // };

  // updateTrackingMinAlerts() {
  //   const updatedData: UpdateTrackingAlertsInterface = {};
  //   if (this.currentTrackingValue?.minValueAlertActivated === true) {
  //     updatedData['minValueAlertActivated'] = false;
  //   } else {
  //     updatedData['minValueAlertActivated'] = true;
  //   }
  //   updatedData['userId'] = parseInt(this.id!);
  //   this.profileUserService
  //     .updateTrackingAlerts(updatedData, this.currentTrackingValueId!.toString(), this.token!)
  //     .subscribe((response) => {
  //       this.profileUserService
  //       .getTrackingValuesByUser(this.id!, this.token!)
  //       .subscribe((trackingValues) => {
  //         this.trackingValues = trackingValues;
  //         this.profileUserService.getTrackingValueById(this.currentTrackingValueId!.toString(), this.token!).subscribe((response)=>{
  //           this.currentTrackingValue = response;
  //         });
  //       });
  //     });
  // };

  // updateTrackingMaxAlerts() {
  //   const updatedData: UpdateTrackingAlertsInterface = {};
  //   if (this.currentTrackingValue?.maxValueAlertActivated === true) {
  //     updatedData['maxValueAlertActivated'] = false;
  //   } else {
  //     updatedData['maxValueAlertActivated'] = true;
  //   }
  //   updatedData['userId'] = parseInt(this.id!);
  //   this.profileUserService
  //     .updateTrackingAlerts(updatedData, this.currentTrackingValueId!.toString(), this.token!)
  //     .subscribe((response) => {
  //       this.profileUserService
  //       .getTrackingValuesByUser(this.id!, this.token!)
  //       .subscribe((trackingValues) => {
  //         this.trackingValues = trackingValues;
  //         this.profileUserService.getTrackingValueById(this.currentTrackingValueId!.toString(), this.token!).subscribe((response)=>{
  //           this.currentTrackingValue = response;
  //         });
  //       });
  //     });
  // };

  // AddCurrentValue(trackingValueId: number, formData: NgForm) {
  //   if (!formData.value) {
  //     return;
  //   }
  //   const currentValueData: UpdateCurrentValueInterface = formData.value;
  //   currentValueData.userId = Number(this.id!);
  //   this.profileUserService.updateCurrentValue(trackingValueId.toString(), currentValueData, this.token!).subscribe(
  //     (response) => {
  //       this.confirmAddCurrentValue = true;
  //       this.profileUserService
  //         .getTrackingValuesByUser(this.id!, this.token!)
  //         .subscribe((trackingValues) => {
  //           this.trackingValues = trackingValues;
  //           this.profileUserService.getTrackingValueById(this.currentTrackingValueId!.toString(), this.token!).subscribe((response)=>{
  //             this.currentTrackingValue = response;
  //           });
  //         });
  //     },
  //     (errorMessage) => {
  //       console.log(errorMessage);
  //       this.errorAlertCurrentValue = errorMessage;
  //     }
  //   );
  //   formData.reset();
  // }

  // closeDeleteTrackingValueModal() {
  //   this.displayTrackingDeleteModal = 'none';
  // }
  // closeTrackingViewModal() {
  //   this.displayTrackingViewModal = 'none';
  // }
  // closeTrackingEditModal() {
  //   this.displayTrackingEditModal = 'none';
  // }
  // closeTrackingCreateModal() {
  //   this.displayTrackingCreateModal = 'none';
  // }

  // closeTrackingAlertsModal() {
  //   this.displayTrackingAlertsModal = 'none';
  // }
  // OpenTrackingModalCreate() {
  //   this.displayTrackingCreateModal = 'block';
  // }

  // openTrackingDeleteModal(idTrackingValue: number) {
  //   this.currentTrackingValueId = idTrackingValue;
  //   this.getTrackingValueById(idTrackingValue).subscribe(() => {
  //     this.displayTrackingDeleteModal = 'block';
  //   });
  // }
  // openTrackingViewModal(idTrackingValue: number) {
  //   this.currentTrackingValueId = idTrackingValue;
  //   this.getTrackingValueById(idTrackingValue).subscribe(() => {
  //     this.displayTrackingViewModal = 'block';
  //   });
  // }
  // openTrackingEditModal(idTrackingValue: number) {
  //   this.currentTrackingValueId = idTrackingValue;
  //   this.profileUserService.getTrackingValueById(idTrackingValue.toString(), this.token!).subscribe((response)=>{
  //     this.currentTrackingValue = response;
  //     this.displayTrackingEditModal = 'block';
  //   });
  // }

  // openTrackingAlertsModal(idTrackingValue: number) {
  //   this.currentTrackingValueId = idTrackingValue;
  //   this.profileUserService.getTrackingValueById(idTrackingValue.toString(), this.token!).subscribe((response)=>{
  //     this.currentTrackingValue = response;
  //     this.displayTrackingAlertsModal = 'block';
  //   });
  // }

  // closeConfirmTrackingValueUpdate() {
  //   this.confirmUpdatedTrackingValue = false;
  // }

  // closeConfirmCurrentValueUpdate() {
  //   this.confirmUpdatedCurrentValue = false;
  // }

  // closeConfirmAddCurrentValue() {
  //   this.confirmAddCurrentValue = false;
  // }

  // closeConfirmAddTrackingValue() {
  //   this.confirmAddedTrackingValue = false;
  // }

  // closeConfirmTrackingAlertsUpdate() {
  //   this.confirmUpdatedTrackingAlerts = false;
  // }

  // ngOnDestroy(): void {
  //   this.sicknessUsb?.unsubscribe();
  //   this.currentValuesUsb?.unsubscribe();
  //   this.allergiesUsb?.unsubscribe();
  //   this.trackingValuesUsb?.unsubscribe();
  //   clearInterval(this.timer);
  // }



