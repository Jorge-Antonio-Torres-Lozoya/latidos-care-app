import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Observable, Subject, Subscription, switchMap } from 'rxjs';
import { NgForm } from '@angular/forms';
import { Color, ScaleType, LegendPosition } from '@swimlane/ngx-charts';
import { CurrentValues } from '../../shared/interfaces/current-values.interface';
import { MedicationInterface } from '../../shared/interfaces/medication.interface';
import { ProfileUserService } from '../profile-user/profile-user.service';
import { SearchCurrentValuesInterface } from '../../shared/interfaces/search-current-values.interface';
import { formatDate } from '../../shared/helpers/helperFunctions';
import { TreatmentInterface } from '../../shared/interfaces/new-treatment.interface';
import { SicknessInterface } from '../../shared/interfaces/sickness.interface';
import { AllergyInterface } from '../../shared/interfaces/allergy.interface';
import { TrackingValueInterface } from '../../shared/interfaces/tracking-value.interface';
import { CreateSicknessInterface } from '../../shared/interfaces/create-sickness.interface';
import { UpdateSicknessInterface } from '../../shared/interfaces/update-sickness.interface';
import { CreateMedicationInterface } from '../../shared/interfaces/create-medication.interface';
import { CreateAllergyInterface } from '../../shared/interfaces/create-allergy.interface';
import { UpdateAllergyInterface } from '../../shared/interfaces/update-allergy.interface';
import { CreateTrackingValueInterface } from '../../shared/interfaces/create-tracking-value.interface';
import { UpdateTrackingValueInterface } from '../../shared/interfaces/update-tracking-value.interface';
import { UpdateCurrentValueInterface } from '../../shared/interfaces/update-current-value.interface';
import { UpdateMedicationInterface } from '../../shared/interfaces/update-medication.interface';
import { UpdateTrackingAlertsInterface } from '../../shared/interfaces/update-tracking-alerts.interface';

@Component({
  selector: 'app-advanced-data-user',
  templateUrl: './advanced-data-user.component.html',
  styleUrls: ['./advanced-data-user.component.css']
})
export class AdvancedDataUserComponent implements OnInit, OnDestroy {
  token = this.route.snapshot.queryParamMap.get('token')
  errorCurrentValue?:string;
  errorTreatment?:string;
  displayConfirmation: string = 'none';
  isLoadingValues:boolean = true;
  valuesDisplays:boolean = false;
  valuesEmpty:boolean = false;
  treatmentsDisplay:boolean = false;
  isLoadingTreatments:boolean = true;
  treatmentsEmpty:boolean = false;
  id = this.route.snapshot.paramMap.get('userId');
  sicknesses?: SicknessInterface[];
  sicknessUsb?: Subscription;
  allergies?: AllergyInterface[]
  allergiesUsb?:Subscription
  trackingValues?: TrackingValueInterface[];
  trackingValuesUsb?: Subscription;
  currentValues?:CurrentValues[];
  currentValuesUsb?:Subscription;
  treatments?:any[];
  treatmentsUsb?:Subscription;
  timeFrameOfTreatment?:string;
  // options currentValues
  legend: boolean = true;
  multi?: any[]
  showLabels: boolean = true;
  animations: boolean = true;
  xAxis: boolean = true;
  yAxis: boolean = true;
  showYAxisLabel: boolean = true;
  showXAxisLabel: boolean = true;
  xAxisLabel: string = 'Fechas';
  yAxisLabel: string = 'Nivel';
  timeline: boolean = true;
  colorScheme: Color = { domain: ['#99CCE5', '#FF7F7F'], group: ScaleType.Ordinal, selectable: true, name: 'Customer Usage', };

  // options currentValues
  single?: any[];
  gradient: boolean = true;
  showLegend: boolean = true;
  //showLabelsTreatment: boolean = true;
  isDoughnut: boolean = false;
  legendPosition: LegendPosition = LegendPosition.Right;
  colorSchemeTreatment: Color = { domain: ['#99CCE5', '#FF7F7F'], group: ScaleType.Ordinal, selectable: true, name: 'Customer Usage', };
  private destroy$ = new Subject<void>();
  timer: any;
  minutes: number = 15;
  seconds: number = 0;

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

  //tracking values
  trackingValueById?: TrackingValueInterface
  displayTrackingDeleteModal: string = 'none';
  displayTrackingCreateModal: string = 'none';
  displayTrackingViewModal: string = 'none';
  displayTrackingEditModal: string = 'none';
  displayTrackingAlertsModal: string = 'none';
  currentTrackingValueId?: number;
  currentTrackingValue?: TrackingValueInterface;
  confirmAddedTrackingValue:boolean = false;
  confirmUpdatedTrackingValue:boolean = false;
  confirmTrackingUpdatedCurrentValue:boolean = false;
  confirmAddCurrentValue:boolean = false;
  confirmUpdatedTrackingAlerts: boolean = false;
  errorAlertCurrentValue?: string = undefined;
  errorTrackingAlert?: string = undefined;

  constructor(private route: ActivatedRoute, private profileUserService: ProfileUserService, private router: Router) {}

  ngOnInit(): void {
    this.profileUserService.validateVerificationTokenUser(this.id!, this.token!).subscribe((response) => {
      if(response.validated === false) {
        this.router.navigate(['unauthorized']);
      }

    })
    this.sicknessUsb = this.profileUserService.getAllSicknessByUser(this.id!, this.token!).subscribe((response) => {
      this.sicknesses = response;
    });
    this.allergiesUsb = this.profileUserService.getAllergiesByUser(this.id!, this.token!).subscribe((response) => {
      this.allergies = response;
    });
    this.trackingValuesUsb = this.profileUserService.getTrackingValuesByUser(this.id!, this.token!).subscribe((response) => {
      this.trackingValues = response;
    });
    // 15 minutes timer
    setTimeout(() => {
      this.router.navigate(['time-out']);
    }, 15 * 60 * 1000);
    this.startTimer();
  }

  setCurrentMedication(medication:MedicationInterface) {
    this.currentMedication = medication;
    this.currentMedicationId = medication.medicationId!.toString();
  }

  searchCurrentValue(form:NgForm) {
    this.valuesEmpty = false;
    this.valuesDisplays = true;
    let searchValues:SearchCurrentValuesInterface = form.value
    const startDate: Date = new Date(searchValues.startYear, searchValues.startMonth - 1, searchValues.startDay);
    const endDate: Date = new Date(searchValues.endYear, searchValues.endMonth - 1, searchValues.endDay);
    const startDateString:string = startDate.toISOString();
    const endDateString:string = endDate.toISOString();
    console.log(startDateString);
    console.log(endDateString);
    this.currentValuesUsb = this.profileUserService.getCurrentValueByDate(this.id!, startDateString, endDateString, this.token!).subscribe((response) => {
      if(response.length > 0) {
        this.currentValues = response;
        this.multi = this.transformDataValues(response)
        console.log(this.multi);
        this.isLoadingValues = false;
      } else {
        this.valuesDisplays = false;
        this.isLoadingValues = false;
        this.valuesEmpty = true;
      }
    }, errorMessage => {
      console.log(errorMessage);
      this.errorCurrentValue = errorMessage;
    })
    form.reset();
  }

  searchTreatmentsByMedication(form:NgForm) {
    this.treatmentsEmpty = false;
    this.treatmentsDisplay = true;
    let searchTreatment:SearchCurrentValuesInterface = form.value;
    const startDate:Date = new Date(searchTreatment.startYear, searchTreatment.startMonth -1, searchTreatment.startDay);
    const endDate:Date = new Date(searchTreatment.endYear, searchTreatment.endMonth -1, searchTreatment.endDay);
    const startDateString:string = startDate.toISOString();
    const endDateString:string = endDate.toISOString();
    if(this.currentMedicationId) {
      console.log(this.currentMedicationId);
      this.treatmentsUsb = this.profileUserService.getTreatmentsByDate(this.currentMedicationId!, startDateString, endDateString, this.token!)
      .subscribe((response) => {
        if(response.length > 0) {
          this.treatments = response;
          this.single = this.transformDataTreatment(response);
          this.timeFrameOfTreatment = `Este gráfico representa la cantidad de veces que el usuario a tomado su
          medicina desde ${startDate} al ${endDate}`
          this.isLoadingTreatments = false;
        } else {
          this.treatmentsDisplay = false;
          this.isLoadingTreatments = false;
          this.treatmentsEmpty = true;
        }
      }, errorMessage => {
        console.log(errorMessage);
        this.errorTreatment = errorMessage;
      })
    }
    form.reset();
  }

  handleErrorCurrentValue() {
    this.errorCurrentValue = undefined;
  }

  handleErrorTreatment() {
    this.errorTreatment = undefined;
  }

  transformDataValues(data: any[]): any[] {
    // Group data by sicknessName
    const groupedData: { [key: string]: any[] } = {};
    data.forEach(item => {
      const trackingValueName = item.trackingValue.trackingValueName;
      if (!groupedData[trackingValueName]) {
        groupedData[trackingValueName] = [];
      }
      groupedData[trackingValueName].push({
        name: formatDate(item.createdAt),
        value: item.currentNumber
      });
    });

    // Convert to the required format
    const transformedData = Object.keys(groupedData).map(trackingValueName => ({
      name: trackingValueName,
      series: groupedData[trackingValueName]
    }));

    return transformedData;
  }

  transformDataTreatment(data: TreatmentInterface[]): any[] {
    let takenCount = 0;
    let notTakenCount = 0;

    data.forEach(item => {
      if (item.taken) {
        takenCount++;
      } else {
        notTakenCount++;
      }
    });
    return [
      { name: 'Tomó medicina', value: takenCount },
      { name: 'No tomó medicina', value: notTakenCount }
    ];
  }

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


  //Sickness
  handleError?() {
    this.errorAlert = undefined;
  }
  handleErrorMedication?() {
    this.errorAlertMedication = undefined;
  }

  getSicknessById(idSickness: number): Observable<any> {
    this.currentSicknessId = idSickness;
    return this.profileUserService
      .getSicknessById(this.currentSicknessId!.toString(), this.token!)
      .pipe(
        switchMap((sicknessById) => {
          this.sicknessById = sicknessById;
          console.log(sicknessById.medications);
          return new Observable((observer) => {
            observer.next();
            observer.complete();
          });
        })
      );
  }

  deleteSickness() {
    this.profileUserService
      .deleteSickness(this.currentSicknessId!.toString(), this.token!)
      .subscribe((response) => {
        this.sicknesses = this.sicknesses!.filter(
          (sickness) =>
            sickness.sicknessId !== this.currentSicknessId
        );
        this.displayDeleteModal = 'none';
      });
  }

  addPersonalizedSickness(form: NgForm) {
    const sicknessData: CreateSicknessInterface = form.value;
    sicknessData.userId = Number(this.id!);
    this.profileUserService.createSickness(sicknessData, this.token!).subscribe(
      (response) => {
        this.confirmAddedSickness = true;
        this.profileUserService
          .getAllSicknessByUser(this.id!, this.token!)
          .subscribe((sicknesses) => {
            this.sicknesses = sicknesses;
          });
      },
      (errorMessage) => {
        console.log(errorMessage);
        this.errorAlert = errorMessage;
      }
    );
    form.reset();
  }
  updateSickness: ( formData: NgForm) => void = (
    formData
  ) => {
    if (!formData.value) {
      return;
    }
    const updatedData: UpdateSicknessInterface = formData.value;
    this.profileUserService
      .editSickness(updatedData, this.currentSicknessId!.toString(), this.token!)
      .subscribe((response) => {
        this.confirmUpdatedSickness = true;
        this.profileUserService
        .getAllSicknessByUser(this.id!, this.token!)
        .subscribe((sicknesses) => {
          this.sicknesses = sicknesses;
          this.profileUserService.getSicknessById(this.currentSicknessId!.toString(), this.token!).subscribe((response)=>{
            this.currentSickness = response;
          });
        });
      });
      formData.reset();
  };

  AddMedication(sicknessId: number, formData: NgForm) {
    if (!formData.value) {
      return;
    }
    const medicationData: CreateMedicationInterface = formData.value;
    medicationData.sicknessId = sicknessId;
    medicationData.userId = Number(this.id!);
    this.profileUserService.createMedication(medicationData, this.token!).subscribe(
      (response) => {
        this.confirmAddMedicine = true;
        this.profileUserService
          .getAllSicknessByUser(this.id!, this.token!)
          .subscribe((sicknesses) => {
            this.sicknesses = sicknesses;
          });
      },
      (errorMessage) => {
        console.log(errorMessage);
        this.errorAlertMedication = errorMessage;
      }
    );
    formData.reset();
  }

  //medication
  goToMedications(medication: MedicationInterface) {
    this.currentMedication = medication
    this.currentMedicationId = medication.medicationId!.toString();
    this.displayViewModal = 'none';
    this.displayMedicationOptionsModal = 'block';
  }

  openMedicationEdit() {
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
    this.currentMedication = undefined;
    this.currentMedicationId = undefined;
  }
  closeViewMedicationModal() {
    this.displayMedicationViewModal = 'none';
    this.currentMedication = undefined;
    this.currentMedicationId = undefined;
  }
  closeEditMedicationModal() {
    this.displayMedicationEditModal = 'none';
    this.currentMedication = undefined;
    this.currentMedicationId = undefined;
  }
  closeOptionsMedicationModal() {
    this.displayMedicationOptionsModal = 'none';
    this.currentMedication = undefined;
    this.currentMedicationId = undefined;
  }

  deleteUserMedication() {
    this.profileUserService
      .deleteMedication(this.currentMedicationId!.toString(), this.token!)
      .subscribe((response) => {
        this.sicknessUsb = this.profileUserService.getAllSicknessByUser(this.id!, this.token!).subscribe((response) => {
          this.sicknesses = response;
        });
        this.displayMedicationDeleteModal = 'none';
      });
  }

  updateMedication: ( formData: NgForm) => void = (
    formData
  ) => {
    if (!formData.value) {
      return;
    }
    const updatedData: UpdateMedicationInterface = {};
    if (formData.value.medicationName) {
      updatedData['medicationName'] = formData.value.medicationName;
    }
    if (formData.value.timeConsumption) {
      updatedData['timeConsumption'] = formData.value.timeConsumption;
    }

    this.profileUserService
      .updateMedication(updatedData, this.currentMedicationId!.toString(), this.token!)
      .subscribe((response) => {
        this.confirmEditMedicine = true;
        this.currentMedication = response;
        this.sicknessUsb = this.profileUserService.getAllSicknessByUser(this.id!, this.token!).subscribe((response) => {
          this.sicknesses = response;
        });
        this.displayMedicationEditModal = 'none';
      });
      formData.reset();
  };

  closeEditMedicationConfirmation() {
    this.confirmEditMedicine = false;
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
    this.displayCreateModal = 'block';
  }

  openDeleteModal(idSickness: number) {
    this.currentSicknessId = idSickness;
    this.getSicknessById(idSickness).subscribe(() => {
      this.displayDeleteModal = 'block';
    });
  }
  openViewModal(idSickness: number) {
    this.currentSicknessId = idSickness;
    this.getSicknessById(idSickness).subscribe(() => {
      this.displayViewModal = 'block';
    });
  }
  openEditModal(idSickness: number) {
    this.currentSicknessId = idSickness;
    this.profileUserService.getSicknessById(idSickness.toString(), this.token!).subscribe((response)=>{
      this.currentSickness = response;
      this.displayEditModal = 'block';
    });
  }

  closeConfirmSicknesUpdate() {
    this.confirmUpdatedSickness = false;
  }

  closeConfirmValueUpdate() {
    this.confirmUpdatedCurrentValue = false;
  }

  closeConfirmAddMedication() {
    this.confirmAddMedicine = false;
  }

  closeConfirmAddSickness() {
    this.confirmAddedSickness = false;
  }

  //Allergies
  handleAllergyError?() {
    this.errorAllergyAlert = undefined;
  }

  getAllergyById(idAllergy: number): Observable<any> {
    this.currentAllergyId = idAllergy;
    return this.profileUserService
      .getAllergyById(this.currentAllergyId!.toString(), this.token!)
      .pipe(
        switchMap((allergyById) => {
          this.allergyById = allergyById;
          return new Observable((observer) => {
            observer.next();
            observer.complete();
          });
        })
      );
  }

  deleteAllergy() {
    this.profileUserService
      .deleteAllergy(this.currentAllergyId!.toString(), this.token!)
      .subscribe((response) => {
        this.allergies = this.allergies!.filter(
          (allergy) =>
          allergy.allergyId !== this.currentAllergyId
        );
        this.displayAllergyDeleteModal = 'none';
      });
  }

  addAllergy(form: NgForm) {
    const allergyData: CreateAllergyInterface = form.value;
    allergyData.userId = Number(this.id!);
    this.profileUserService.createAllergy(allergyData, this.token!).subscribe(
      (response) => {
        this.confirmAddedAllergy = true;
        this.profileUserService
          .getAllergiesByUser(this.id!, this.token!)
          .subscribe((allergies) => {
            this.allergies = allergies;
          });
      },
      (errorMessage) => {
        console.log(errorMessage);
        this.errorAlert = errorMessage;
      }
    );
    form.reset();
  }
  updateAllergy: ( formData: NgForm) => void = (
    formData
  ) => {
    if (!formData.value) {
      return;
    }
    const updatedData: UpdateAllergyInterface = {};
    if (formData.value.allergyName) {
      updatedData['allergyName'] = formData.value.allergyName;
    }
    this.profileUserService
      .updateAllergy(updatedData, this.currentAllergyId!.toString(), this.token!)
      .subscribe((response) => {
        this.confirmUpdatedAllergy = true;
        this.profileUserService
        .getAllergiesByUser(this.id!, this.token!)
        .subscribe((allergies) => {
          this.allergies = allergies;
          this.profileUserService.getAllergyById(this.currentAllergyId!.toString(), this.token!).subscribe((response)=>{
            this.currentAllergy = response;
          });
        });
      });
  };

  closeDeleteAllergyModal() {
    this.displayAllergyDeleteModal = 'none';
  }
  closeAllergyViewModal() {
    this.displayAllergyViewModal = 'none';
  }
  closeAllergyEditModal() {
    this.displayAllergyEditModal = 'none';
  }
  closeAllergyCreateModal() {
    this.displayAllergyCreateModal = 'none';
  }
  OpenAllergyModalCreate() {
    this.displayAllergyCreateModal = 'block';
  }

  openAllergyDeleteModal(idAllergy: number) {
    this.currentAllergyId = idAllergy;
    this.getAllergyById(idAllergy).subscribe(() => {
      this.displayAllergyDeleteModal = 'block';
    });
  }
  openAllergyViewModal(idAllergy: number) {
    this.currentAllergyId = idAllergy;
    this.getAllergyById(idAllergy).subscribe(() => {
      this.displayAllergyViewModal = 'block';
    });
  }
  openAllergyEditModal(idAllergy: number) {
    this.currentAllergyId = idAllergy;
    this.profileUserService.getAllergyById(idAllergy.toString(), this.token!).subscribe((response)=>{
      this.currentAllergy = response;
      this.displayAllergyEditModal = 'block';
    });
  }

  closeConfirmAllergyUpdate() {
    this.confirmUpdatedAllergy = false;
  }

  closeConfirmAddAllergy() {
    this.confirmAddedAllergy = false;
  }

  //Tracking Values

  handleTrackingError?() {
    this.errorTrackingAlert = undefined;
  }
  handleTrackingErrorCurrentValue?() {
    this.errorAlertCurrentValue = undefined;
  }

  getTrackingValueById(idTrackingValue: number): Observable<any> {
    this.currentTrackingValueId = idTrackingValue;
    return this.profileUserService
      .getTrackingValueById(this.currentTrackingValueId!.toString(), this.token!)
      .pipe(
        switchMap((trackingValueById) => {
          this.trackingValueById = trackingValueById;
          return new Observable((observer) => {
            observer.next();
            observer.complete();
          });
        })
      );
  }

  deleteTrackingValue() {
    this.profileUserService
      .deleteTrackingValue(this.currentTrackingValueId!.toString(), this.token!)
      .subscribe((response) => {
        this.trackingValues = this.trackingValues!.filter(
          (trackingValue) =>
          trackingValue.trackingValueId !== this.currentTrackingValueId
        );
        this.displayTrackingDeleteModal = 'none';
      });
  }

  addTrackingValue(form: NgForm) {
    const trackingValueData: CreateTrackingValueInterface = form.value;
    trackingValueData.userId = Number(this.id!);
    this.profileUserService.createTrackingValue(trackingValueData, this.token!).subscribe(
      (response) => {
        this.confirmAddedTrackingValue = true;
        this.profileUserService
          .getTrackingValuesByUser(this.id!, this.token!)
          .subscribe((trackingValues) => {
            this.trackingValues = trackingValues;
          });
      },
      (errorMessage) => {
        console.log(errorMessage);
        this.errorAlert = errorMessage;
      }
    );
    form.reset();
  }
  updateTrackingValue: ( formData: NgForm) => void = (
    formData
  ) => {
    if (!formData.value) {
      return;
    }
    const updatedData: UpdateTrackingValueInterface = {};
    if (formData.value.trackingValueName) {
      updatedData['trackingValueName'] = formData.value.trackingValueName;
    }
    if (formData.value.minLimit) {
      updatedData['minLimit'] = Number(formData.value.minLimit);
    }
    if (formData.value.maxLimit) {
      updatedData['maxLimit'] = Number(formData.value.maxLimit);
    }
    this.profileUserService
      .updateTrackingValue(updatedData, this.currentTrackingValueId!.toString(), this.token!)
      .subscribe((response) => {
        this.confirmUpdatedTrackingValue = true;
        this.profileUserService
        .getTrackingValuesByUser(this.id!, this.token!)
        .subscribe((trackingValues) => {
          this.trackingValues = trackingValues;
          this.profileUserService.getTrackingValueById(this.currentTrackingValueId!.toString(), this.token!).subscribe((response)=>{
            this.currentTrackingValue = response;
          });
        });
      });
  };

  updateTrackingAlertsMessages(formData: NgForm) {
    if (!formData.value) {
      return;
    }
    const updatedData: UpdateTrackingAlertsInterface = {};
    if (formData.value.personalizedAlertMinValue) {
      updatedData['personalizedAlertMinValue'] = formData.value.personalizedAlertMinValue;
    }
    if (formData.value.personalizedAlertMaxValue) {
      updatedData['personalizedAlertMaxValue'] = formData.value.personalizedAlertMaxValue;
    }
    updatedData['userId'] = parseInt(this.id!);
    this.profileUserService
      .updateTrackingAlerts(updatedData, this.currentTrackingValueId!.toString(), this.token!)
      .subscribe((response) => {
        this.confirmUpdatedTrackingAlerts = true;
        this.profileUserService
        .getTrackingValuesByUser(this.id!, this.token!)
        .subscribe((trackingValues) => {
          this.trackingValues = trackingValues;
          this.profileUserService.getTrackingValueById(this.currentTrackingValueId!.toString(), this.token!).subscribe((response)=>{
            this.currentTrackingValue = response;
          });
        });
      });
      formData.reset();
  };

  updateTrackingAlerts() {
    const updatedData: UpdateTrackingAlertsInterface = {};
    if (this.currentTrackingValue?.alertActivated === true) {
      updatedData['alertActivated'] = false;
    } else {
      updatedData['alertActivated'] = true;
    }
    updatedData['userId'] = parseInt(this.id!);
    this.profileUserService
      .updateTrackingAlerts(updatedData, this.currentTrackingValueId!.toString(), this.token!)
      .subscribe((response) => {
        this.profileUserService
        .getTrackingValuesByUser(this.id!, this.token!)
        .subscribe((trackingValues) => {
          this.trackingValues = trackingValues;
          this.profileUserService.getTrackingValueById(this.currentTrackingValueId!.toString(), this.token!).subscribe((response)=>{
            this.currentTrackingValue = response;
          });
        });
      });
  };

  updateTrackingMinAlerts() {
    const updatedData: UpdateTrackingAlertsInterface = {};
    if (this.currentTrackingValue?.minValueAlertActivated === true) {
      updatedData['minValueAlertActivated'] = false;
    } else {
      updatedData['minValueAlertActivated'] = true;
    }
    updatedData['userId'] = parseInt(this.id!);
    this.profileUserService
      .updateTrackingAlerts(updatedData, this.currentTrackingValueId!.toString(), this.token!)
      .subscribe((response) => {
        this.profileUserService
        .getTrackingValuesByUser(this.id!, this.token!)
        .subscribe((trackingValues) => {
          this.trackingValues = trackingValues;
          this.profileUserService.getTrackingValueById(this.currentTrackingValueId!.toString(), this.token!).subscribe((response)=>{
            this.currentTrackingValue = response;
          });
        });
      });
  };

  updateTrackingMaxAlerts() {
    const updatedData: UpdateTrackingAlertsInterface = {};
    if (this.currentTrackingValue?.maxValueAlertActivated === true) {
      updatedData['maxValueAlertActivated'] = false;
    } else {
      updatedData['maxValueAlertActivated'] = true;
    }
    updatedData['userId'] = parseInt(this.id!);
    this.profileUserService
      .updateTrackingAlerts(updatedData, this.currentTrackingValueId!.toString(), this.token!)
      .subscribe((response) => {
        this.profileUserService
        .getTrackingValuesByUser(this.id!, this.token!)
        .subscribe((trackingValues) => {
          this.trackingValues = trackingValues;
          this.profileUserService.getTrackingValueById(this.currentTrackingValueId!.toString(), this.token!).subscribe((response)=>{
            this.currentTrackingValue = response;
          });
        });
      });
  };

  AddCurrentValue(trackingValueId: number, formData: NgForm) {
    if (!formData.value) {
      return;
    }
    const currentValueData: UpdateCurrentValueInterface = formData.value;
    currentValueData.userId = Number(this.id!);
    this.profileUserService.updateCurrentValue(trackingValueId.toString(), currentValueData, this.token!).subscribe(
      (response) => {
        this.confirmAddCurrentValue = true;
        this.profileUserService
          .getTrackingValuesByUser(this.id!, this.token!)
          .subscribe((trackingValues) => {
            this.trackingValues = trackingValues;
            this.profileUserService.getTrackingValueById(this.currentTrackingValueId!.toString(), this.token!).subscribe((response)=>{
              this.currentTrackingValue = response;
            });
          });
      },
      (errorMessage) => {
        console.log(errorMessage);
        this.errorAlertCurrentValue = errorMessage;
      }
    );
    formData.reset();
  }

  closeDeleteTrackingValueModal() {
    this.displayTrackingDeleteModal = 'none';
  }
  closeTrackingViewModal() {
    this.displayTrackingViewModal = 'none';
  }
  closeTrackingEditModal() {
    this.displayTrackingEditModal = 'none';
  }
  closeTrackingCreateModal() {
    this.displayTrackingCreateModal = 'none';
  }

  closeTrackingAlertsModal() {
    this.displayTrackingAlertsModal = 'none';
  }
  OpenTrackingModalCreate() {
    this.displayTrackingCreateModal = 'block';
  }

  openTrackingDeleteModal(idTrackingValue: number) {
    this.currentTrackingValueId = idTrackingValue;
    this.getTrackingValueById(idTrackingValue).subscribe(() => {
      this.displayTrackingDeleteModal = 'block';
    });
  }
  openTrackingViewModal(idTrackingValue: number) {
    this.currentTrackingValueId = idTrackingValue;
    this.getTrackingValueById(idTrackingValue).subscribe(() => {
      this.displayTrackingViewModal = 'block';
    });
  }
  openTrackingEditModal(idTrackingValue: number) {
    this.currentTrackingValueId = idTrackingValue;
    this.profileUserService.getTrackingValueById(idTrackingValue.toString(), this.token!).subscribe((response)=>{
      this.currentTrackingValue = response;
      this.displayTrackingEditModal = 'block';
    });
  }

  openTrackingAlertsModal(idTrackingValue: number) {
    this.currentTrackingValueId = idTrackingValue;
    this.profileUserService.getTrackingValueById(idTrackingValue.toString(), this.token!).subscribe((response)=>{
      this.currentTrackingValue = response;
      this.displayTrackingAlertsModal = 'block';
    });
  }

  closeConfirmTrackingValueUpdate() {
    this.confirmUpdatedTrackingValue = false;
  }

  closeConfirmCurrentValueUpdate() {
    this.confirmUpdatedCurrentValue = false;
  }

  closeConfirmAddCurrentValue() {
    this.confirmAddCurrentValue = false;
  }

  closeConfirmAddTrackingValue() {
    this.confirmAddedTrackingValue = false;
  }

  closeConfirmTrackingAlertsUpdate() {
    this.confirmUpdatedTrackingAlerts = false;
  }

  ngOnDestroy(): void {
    this.sicknessUsb?.unsubscribe();
    this.currentValuesUsb?.unsubscribe();
    this.allergiesUsb?.unsubscribe();
    this.trackingValuesUsb?.unsubscribe();
    clearInterval(this.timer);
  }


}
