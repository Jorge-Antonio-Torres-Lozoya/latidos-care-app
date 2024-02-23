import {
  Component,
  Inject,
  OnDestroy,
  OnInit,
  PLATFORM_ID,
} from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Observable, Subscription, switchMap } from 'rxjs';
import { NgForm } from '@angular/forms';
import { Color, ScaleType} from '@swimlane/ngx-charts';
import { MedicationInterface } from '../../shared/interfaces/medication.interface';
import { ProfileUserService } from '../profile-user/profile-user.service';
import { SearchCurrentValuesInterface } from '../../shared/interfaces/search-current-values.interface';
import { formatDateHelper } from '../../shared/helpers/helperFunctions';
import { SicknessInterface } from '../../shared/interfaces/sickness.interface';
import { AllergyInterface } from '../../shared/interfaces/allergy.interface';
import { TrackingValueInterface } from '../../shared/interfaces/tracking-value.interface';
import { CreateUserSicknessInterface } from '../../shared/interfaces/create-user-sickness.interface';
import { MedicationSicknessInterface } from '../../shared/interfaces/medication-sickness.interface';
import { UserSicknessInterface } from '../../shared/interfaces/user-sickness.interface';
import { UserAllergyInterface } from '../../shared/interfaces/user-allergy.interface';
import { UserTrackingValueInterface } from '../../shared/interfaces/user-tracking-value.interface';
import { SharedService } from '../../shared/shared.service';
import { CreateMedicationSicknessInterface } from '../../shared/interfaces/create-medication-sickness.interface';
import { CreateUserAllergyInterface } from '../../shared/interfaces/create-user-allergy.interface';
import { AccountInterface } from '../../shared/interfaces/account.interface';
import { UpdateUserTrackingValueInterface } from '../../shared/interfaces/update-user-trackin-value.interface';
import { CurrentValueInterface } from '../../shared/interfaces/current-value.interface';
import { formatDate, isPlatformBrowser } from '@angular/common';

@Component({
  selector: 'app-data-pacient',
  templateUrl: './data-pacient.component.html',
  styleUrls: ['./data-pacient.component.css'],
})
export class DataPacientComponent implements OnInit, OnDestroy {
  token = this.route.snapshot.queryParamMap.get('token');
  accountId?: string;
  slug: string = this.route.snapshot.paramMap.get('slug')!;
  account?: AccountInterface;
  private accountUsb?: Subscription;

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

  // grafica
  errorCurrentValue?: string;
  displayConfirmation: string = 'none';
  isLoadingValues: boolean = true;
  valuesDisplays: boolean = false;
  valuesEmpty: boolean = false;
  currentValues?: CurrentValueInterface[];
  currentValuesUsb?: Subscription;
  legend: boolean = true;
  multi?: any[];
  showLabels: boolean = true;
  animations: boolean = true;
  xAxis: boolean = true;
  yAxis: boolean = true;
  showYAxisLabel: boolean = true;
  showXAxisLabel: boolean = true;
  xAxisLabel: string = 'Fechas';
  yAxisLabel: string = 'Nivel';
  timeline: boolean = true;

  colorScheme: Color = {
    domain: ['#99CCE5', '#FF7F7F'],
    group: ScaleType.Ordinal,
    selectable: true,
    name: 'Customer Usage',
  };
  selectedDays: number | null = null;
  selectedTrackingValues: string[] = [];

  startDate: string | null = null;
  endDate: string | null = null;

  // timer
  minutes: number = 15;
  seconds: number = 0;
  timer: any;

  isMobile: boolean = false;
  private windowSub?: Subscription;

  constructor(
    private profileUserService: ProfileUserService,
    private route: ActivatedRoute,
    private sharedService: SharedService,
    private router: Router,
    @Inject(PLATFORM_ID) private platformId: Object
  ) {}

  ngOnInit(): void {

    this.accountUsb = this.sharedService
      .getAccountBySlug(this.slug)
      .subscribe((account) => {
        this.account = account;
        this.accountId = account.accountId.toString();

        this.profileUserService.validateVerificationTokenAccount(this.accountId!, this.token!).subscribe((response) => {
          if(response.validated === false) {
            this.router.navigate(['unauthorized']);
          }
        })

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
      });

    if (isPlatformBrowser(this.platformId)) {
      this.startTimer();
    }
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
        this.accountId!,
        this.token!
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
        this.accountId!,
        this.token!
      )
      .subscribe((response) => {
        this.currentMedicationSicknesses =
          this.currentMedicationSicknesses!.filter(
            (medicationSickness) =>
              medicationSickness.medicationSicknessId !== medicationSicknessId
          );
        this.ngOnInit();
      });
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
        this.accountId!,
        this.token!
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
      .deleteUserAllergy(
        this.currentUserAllergyId!.toString(),
        this.accountId!,
        this.token!
      )
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
    this.confirmUpdateUserTrackingValue = false;
    this.errorUserTrackingValue = undefined;
    this.displayErrorUserTrackingValue = false;
    this.currentUserTrackingValueId = idUserTrackingValue;
    this.sharedService
      .getUserTrackingValueById(this.currentUserTrackingValueId!.toString())
      .subscribe((response) => {
        this.currentUserTrackingValue = response;
        this.displayTrackingValuesEditModal = 'block';
      });
  }

  updateUserTrackingValue(formData: NgForm) {
    if (!formData.value) {
      return;
    }
    const updatedData: UpdateUserTrackingValueInterface = {};
    if (formData.value.currentValue) {
      updatedData['currentValue'] = formData.value.currentValue;
    }
    if (formData.value.minLimit) {
      updatedData['minLimit'] = Number(formData.value.minLimit);
    }
    if (formData.value.maxLimit) {
      updatedData['maxLimit'] = Number(formData.value.maxLimit);
    }

    this.profileUserService
      .updateUserTrackingValue(
        this.currentUserTrackingValueId!.toString(),
        updatedData,
        this.accountId!,
        this.token!
      )
      .subscribe(
        (response) => {
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
        }
      );
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
      .createUserTrackingValue(
        userTrackingValueData,
        this.accountId!,
        this.token!
      )
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
        this.accountId!,
        this.token!
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

  // timer

  startTimer() {
    this.timer = setInterval(() => {
      if (this.seconds === 0) {
        if (this.minutes === 0) {
          clearInterval(this.timer);
          this.router.navigate(['/time-out']);
          return;
        } else {
          this.minutes--;
          this.seconds = 59;
        }
      } else {
        this.seconds--;
      }
    }, 1000);
  }

  get displayTime() {
    const min = String(this.minutes).padStart(2, '0');
    const sec = String(this.seconds).padStart(2, '0');
    return `${min}:${sec}`;
  }

  // grafica
  setDatesAndSearch(days: number) {
    this.selectedDays = days;
    const endDate = new Date();
    const startDate = new Date();
    startDate.setDate(endDate.getDate() - days);
    endDate.setDate(endDate.getDate() + 2);
    const startDateStr = formatDate(startDate, 'yyyy-MM-dd', 'en-US');
    const endDateStr = formatDate(endDate, 'yyyy-MM-dd', 'en-US');
    this.searchCurrentValue(null!, startDateStr, endDateStr);
    this.applyFilters();
  }

  applyFilters() {
    let startDateStr, endDateStr;

    // Si se han seleccionado días, calcula las fechas de inicio y fin basadas en esa selección
    if (this.selectedDays) {
      const endDate = new Date();
      const startDate = new Date();
      startDate.setDate(endDate.getDate() - this.selectedDays);
      endDate.setDate(endDate.getDate() + 2);
      startDateStr = formatDate(startDate, 'yyyy-MM-dd', 'en-US');
      endDateStr = formatDate(endDate, 'yyyy-MM-dd', 'en-US');
    }

    // Llama a searchCurrentValue con las fechas calculadas (si las hay) para aplicar los filtros
    this.searchCurrentValue(null!, startDateStr, endDateStr);
  }

  searchCurrentValue(
    form?: NgForm,
    startDateStr?: string,
    endDateStr?: string
  ) {
    let startDate, endDate;
    this.valuesEmpty = false;

    if (startDateStr && endDateStr) {
      this.valuesDisplays = true;
      startDate = startDateStr;
      endDate = endDateStr;
    } else if (form) {
      this.selectedDays = null;
      let searchValues: SearchCurrentValuesInterface = form.value;
      if (
        !searchValues.startDate ||
        !searchValues.endDate ||
        !searchValues.startDate.trim() ||
        !searchValues.endDate.trim()
      ) {
        return;
      }
      this.valuesDisplays = true;
      startDate = formatDate(searchValues.startDate, 'yyyy-MM-dd', 'en-US');
      endDate = formatDate(searchValues.endDate, 'yyyy-MM-dd', 'en-US');
    } else {
      return;
    }

    this.currentValuesUsb = this.profileUserService
      .getCurrentValueByDate(this.accountId!, startDate, endDate,this.token!)
      .subscribe(
        (response) => {
          let filteredResponse = response;
          if (this.selectedTrackingValues.length > 0) {
            filteredResponse = response.filter((value) =>
              this.selectedTrackingValues.includes(value.trackingValueName)
            );
          }
          this.multi = this.transformDataValues(filteredResponse);
          this.isLoadingValues = false;
          this.valuesDisplays = filteredResponse.length > 0;
          this.valuesEmpty = filteredResponse.length === 0;
        },
        (errorMessage) => {
          this.errorCurrentValue = errorMessage;
        }
      );
  }

  filterByTrackingValue(valueName: string) {
    const index = this.selectedTrackingValues.indexOf(valueName);
    if (index > -1) {
      this.selectedTrackingValues.splice(index, 1);
    } else {
      this.selectedTrackingValues.push(valueName);
    }
    if (this.startDate && this.endDate) {
      this.searchCurrentValue(null!, this.startDate, this.endDate);
    }
    this.applyFilters();
  }

  handleErrorCurrentValue() {
    this.errorCurrentValue = undefined;
  }

  transformDataValues(data: any[]): any[] {
    // Group data by sicknessName
    const groupedData: { [key: string]: any[] } = {};
    data.forEach((item) => {
      const trackingValueName = item.trackingValueName;
      if (!groupedData[trackingValueName]) {
        groupedData[trackingValueName] = [];
      }
      groupedData[trackingValueName].push({
        name: formatDateHelper(item.createdAt),
        value: item.currentNumber,
      });
    });

    // Convert to the required format
    const transformedData = Object.keys(groupedData).map(
      (trackingValueName) => ({
        name: trackingValueName,
        series: groupedData[trackingValueName],
      })
    );
    return transformedData;
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

    if (this.windowSub) {
      this.windowSub.unsubscribe();
    }

    if (this.timer) {
      clearInterval(this.timer);
    }
  }
}

