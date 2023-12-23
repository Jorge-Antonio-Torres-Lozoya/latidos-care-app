import { Component } from '@angular/core';
import { Observable, Subscription, switchMap } from 'rxjs';
import { TrackingValueInterface } from '../../../shared/interfaces/tracking-value.interface';
import { ProfileUserService } from '../profile-user.service';
import { Router } from '@angular/router';
import { NgForm } from '@angular/forms';
import { CreateTrackingValueInterface } from '../../../shared/interfaces/create-tracking-value.interface';
import { UpdateTrackingValueInterface } from '../../../shared/interfaces/update-tracking-value.interface';
import { UpdateCurrentValueInterface } from '../../../shared/interfaces/update-current-value.interface';
import { SsrCookieService } from 'ngx-cookie-service-ssr';

@Component({
  selector: 'app-tracking-values',
  templateUrl: './tracking-values.component.html',
  styleUrls: ['./tracking-values.component.css']
})
export class TrackingValuesComponent {
  userId?: string;
  userUsb?: Subscription;
  trackingValues?: TrackingValueInterface[];
  trackingValuesUsb?: Subscription;
  trackingValueById?: TrackingValueInterface
  displayDeleteModal: string = 'none';
  displayCreateModal: string = 'none';
  displayViewModal: string = 'none';
  displayEditModal: string = 'none';
  currentTrackingValueId?: number;
  currentTrackingValue?: TrackingValueInterface;
  confirmAddedTrackingValue:boolean = false;
  confirmUpdatedTrackingValue:boolean = false;
  confirmUpdatedCurrentValue:boolean = false;
  confirmAddCurrentValue:boolean = false;
  errorAlertCurrentValue?: string = undefined;
  errorAlert?: string = undefined;

  constructor(
    private profileUserService: ProfileUserService,
    private router: Router,
    private cookieService: SsrCookieService
  ) {}

  ngOnInit(): void {
    this.userId = this.cookieService.get('user_id')!;
    this.userUsb = this.profileUserService
      .getTrackingValuesByUser(this.userId!)
      .subscribe((trackingValues) => {
        this.trackingValues = trackingValues;
      });
  }

  handleError?() {
    this.errorAlert = undefined;
  }
  handleErrorCurrentValue?() {
    this.errorAlertCurrentValue = undefined;
  }

  getTrackingValueById(idTrackingValue: number): Observable<any> {
    this.currentTrackingValueId = idTrackingValue;
    return this.profileUserService
      .getTrackingValueById(this.currentTrackingValueId!.toString())
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
      .deleteTrackingValue(this.currentTrackingValueId!.toString())
      .subscribe((response) => {
        this.trackingValues = this.trackingValues!.filter(
          (trackingValue) =>
          trackingValue.trackingValueId !== this.currentTrackingValueId
        );
        this.displayDeleteModal = 'none';
      });
  }

  addTrackingValue(form: NgForm) {
    const trackingValueData: CreateTrackingValueInterface = form.value;
    trackingValueData.userId = Number(this.userId!);
    this.profileUserService.createTrackingValue(trackingValueData).subscribe(
      (response) => {
        this.confirmAddedTrackingValue = true;
        this.profileUserService
          .getTrackingValuesByUser(this.userId!)
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
      .updateTrackingValue(updatedData, this.currentTrackingValueId!.toString())
      .subscribe((response) => {
        this.confirmUpdatedTrackingValue = true;
        this.profileUserService
        .getTrackingValuesByUser(this.userId!)
        .subscribe((trackingValues) => {
          this.trackingValues = trackingValues;
          this.profileUserService.getTrackingValueById(this.currentTrackingValueId!.toString()).subscribe((response)=>{
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
    currentValueData.userId = Number(this.userId!);
    this.profileUserService.updateCurrentValue(trackingValueId.toString(), currentValueData).subscribe(
      (response) => {
        this.confirmAddCurrentValue = true;
        this.profileUserService
          .getTrackingValuesByUser(this.userId!)
          .subscribe((trackingValues) => {
            this.trackingValues = trackingValues;
            this.profileUserService.getTrackingValueById(this.currentTrackingValueId!.toString()).subscribe((response)=>{
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

  openDeleteModal(idTrackingValue: number) {
    this.currentTrackingValueId = idTrackingValue;
    this.getTrackingValueById(idTrackingValue).subscribe(() => {
      this.displayDeleteModal = 'block';
    });
  }
  openViewModal(idTrackingValue: number) {
    this.currentTrackingValueId = idTrackingValue;
    this.getTrackingValueById(idTrackingValue).subscribe(() => {
      this.displayViewModal = 'block';
    });
  }
  openEditModal(idTrackingValue: number) {
    this.currentTrackingValueId = idTrackingValue;
    this.profileUserService.getTrackingValueById(idTrackingValue.toString()).subscribe((response)=>{
      this.currentTrackingValue = response;
      this.displayEditModal = 'block';
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

  toAdvancedData() {
    this.router.navigateByUrl(`profile-user/${this.userId}/advanced-data-values`)
  }

}
