import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ProfileUserService } from '../profile-user.service';
import { Subscription } from 'rxjs';
import { NgForm } from '@angular/forms';
import { Color, ScaleType } from '@swimlane/ngx-charts';
import { SearchCurrentValuesInterface } from '../../../shared/interfaces/search-current-values.interface';
import { formatDateHelper } from '../../../shared/helpers/helperFunctions';
import { SsrCookieService } from 'ngx-cookie-service-ssr';
import { CurrentValueInterface } from '../../../shared/interfaces/current-value.interface';
import { formatDate } from '@angular/common';
import { UserTrackingValueInterface } from '../../../shared/interfaces/user-tracking-value.interface';
@Component({
  selector: 'app-advanced-data-sickness',
  templateUrl: './advanced-data-sickness.component.html',
  styleUrls: ['./advanced-data-sickness.component.css'],
})
export class AdvancedDataSicknessComponent implements OnInit, OnDestroy {
  errorCurrentValue?: string;
  displayConfirmation: string = 'none';
  isLoadingValues: boolean = true;
  valuesDisplays: boolean = false;
  valuesEmpty: boolean = false;
  id: string = this.cookieService.get('account_id')!;
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

  // userTrackingValues
  userTrackingValuesUsb?: Subscription;
  userTrackingValues?: UserTrackingValueInterface[];

  constructor(
    private route: ActivatedRoute,
    private profileUserService: ProfileUserService,
    private cookieService: SsrCookieService
  ) {}

  ngOnInit(): void {
    this.userTrackingValuesUsb = this.profileUserService
      .getUserTrackingValuesByAccount(this.id!)
      .subscribe((response) => {
        this.userTrackingValues = response;
      });
  }

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
      let searchValues:SearchCurrentValuesInterface = form.value
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
      .getCurrentValueByDate(this.id!, startDate, endDate)
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
    if (this.currentValuesUsb) {
      this.currentValuesUsb.unsubscribe();
    }
    if (this.userTrackingValuesUsb) {
      this.userTrackingValuesUsb.unsubscribe();
    }
  }
}
