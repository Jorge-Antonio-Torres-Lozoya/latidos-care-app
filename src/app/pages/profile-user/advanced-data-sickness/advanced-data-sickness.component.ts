import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ProfileUserService } from '../profile-user.service';
import { Subscription } from 'rxjs';
import { NgForm } from '@angular/forms';
import { Color, ScaleType, LegendPosition } from '@swimlane/ngx-charts';
import { CurrentValues } from '../../../shared/interfaces/current-values.interface';
import { MedicationInterface } from '../../../shared/interfaces/medication.interface';
import { SearchCurrentValuesInterface } from '../../../shared/interfaces/search-current-values.interface';
import { TreatmentInterface } from '../../../shared/interfaces/new-treatment.interface';
import { formatDate } from '../../../shared/helpers/helperFunctions';
import { SicknessInterface } from '../../../shared/interfaces/sickness.interface';
import { SsrCookieService } from 'ngx-cookie-service-ssr';
@Component({
  selector: 'app-advanced-data-sickness',
  templateUrl: './advanced-data-sickness.component.html',
  styleUrls: ['./advanced-data-sickness.component.css']
})
export class AdvancedDataSicknessComponent implements OnInit, OnDestroy {
  errorCurrentValue?:string;
  errorTreatment?:string;
  displayConfirmation: string = 'none';
  isLoadingValues:boolean = true;
  valuesDisplays:boolean = false;
  valuesEmpty:boolean = false;
  treatmentsDisplay:boolean = false;
  isLoadingTreatments:boolean = true;
  treatmentsEmpty:boolean = false;
  //id = this.route.snapshot.paramMap.get('id');
  id:string = this.cookieService.get('user_id')!
  sickness?: SicknessInterface[];
  sicknessUsb?: Subscription;
  currentValues?:CurrentValues[];
  currentValuesUsb?:Subscription;
  medications?:MedicationInterface[];
  currentMedication?:MedicationInterface;
  currentMedicationId?:string;
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

  constructor(private route: ActivatedRoute, private profileUserService: ProfileUserService, private cookieService: SsrCookieService) {}

  ngOnInit(): void {
    /*this.sicknessUsb = this.profileUserService.getUserSicknessByUser(this.id!).subscribe((response) => {
      this.sickness = response;
      this.medications = response.medications;
    })*/
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
      this.currentValuesUsb = this.profileUserService.getCurrentValueByDate(this.id!, startDateString, endDateString).subscribe((response) => {
        if(response.length > 0) {
          this.currentValues = response;
          this.multi = this.transformDataValues(response)
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
      this.treatmentsUsb = this.profileUserService.getTreatmentsByDate(this.currentMedicationId!, startDateString, endDateString)
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

  ngOnDestroy(): void {
    //this.sicknessUsb?.unsubscribe();
    this.currentValuesUsb?.unsubscribe();
    //this.treatmentsUsb?.unsubscribe();
  }
}
