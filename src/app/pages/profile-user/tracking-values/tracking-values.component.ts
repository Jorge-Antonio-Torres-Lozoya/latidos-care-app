import { Component, OnDestroy, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { TrackingValueInterface } from '../../../shared/interfaces/tracking-value.interface';
import { ProfileUserService } from '../profile-user.service';
import { ActivatedRoute, Router } from '@angular/router';
import { NgForm } from '@angular/forms';
import { SsrCookieService } from 'ngx-cookie-service-ssr';
import { UserTrackingValueInterface } from '../../../shared/interfaces/user-tracking-value.interface';
import { SharedService } from '../../../shared/shared.service';
import { CreateUserTrackingValueInterface } from '../../../shared/interfaces/create-user-tracking-value.interface';
import { UpdateUserTrackingValueInterface } from '../../../shared/interfaces/update-user-trackin-value.interface';
import { WindowService } from '../../../shared/window.service';


@Component({
  selector: 'app-tracking-values',
  templateUrl: './tracking-values.component.html',
  styleUrls: ['./tracking-values.component.css']
})
export class TrackingValuesComponent implements OnInit, OnDestroy {
  isMobile: boolean = false;
  private windowSub?: Subscription;

  trackingValues?: TrackingValueInterface[];
  trackingValuesUsb?: Subscription;
  userTrackingValues?: UserTrackingValueInterface[];
  userTrackingValuesUsb?: Subscription;
  displayDeleteModal: string = 'none';

  displayCreateModal: string = 'none';
  confirmAddedTrackingValue:boolean = false;
  errorCreate?:string = undefined;
  displayErrorCreate:boolean = false;

  displayEditModal: string = 'none';
  confirmUpdatedTrackingValue:boolean = false;
  errorUpdated:string = '';
  displayErrorUpdate:boolean = false;

  currentUserTrackingValue?: UserTrackingValueInterface;
  currentTrackingValue?: TrackingValueInterface;


  constructor(
    private profileUserService: ProfileUserService,
    private sharedService: SharedService,
    private router: Router,
    private cookieService: SsrCookieService,
    private windowService: WindowService,
    private route: ActivatedRoute
  ) {}

  ngOnInit(): void {
    this.userTrackingValuesUsb = this.profileUserService
      .getUserTrackingValuesByAccount(this.getAccountId())
      .subscribe((trackingValues) => {
        this.userTrackingValues = trackingValues;
      });
    this.trackingValuesUsb = this.sharedService.getAllTrackingValues().subscribe(trackingValues => {
      this.trackingValues = trackingValues;
    })

    this.windowSub = this.windowService.isMobile$.subscribe(isMobile => {
      this.isMobile = isMobile;
    });
  }

  getAccountId() {
    return this.cookieService.get('account_id');
  }

  //Delete

  openDeleteModal(userTrackingValue: UserTrackingValueInterface) {
    this.currentUserTrackingValue = userTrackingValue;
    this.displayDeleteModal = 'block';
  }

  deleteTrackingValue() {
    this.profileUserService
      .deleteUserTrackingValue(this.currentUserTrackingValue!.userTrackingValueId.toString(), this.getAccountId())
      .subscribe((response) => {
        this.userTrackingValues! = this.userTrackingValues!.filter(
          (userTrackingValue) =>
          userTrackingValue.userTrackingValueId !== this.currentUserTrackingValue!.userTrackingValueId
        );
        this.currentUserTrackingValue = undefined;
        this.displayDeleteModal = 'none';
      });
  }

  closeDeleteTrackingValueModal() {
    this.currentUserTrackingValue = undefined;
    this.displayDeleteModal = 'none';
  }

  //Create
  handleError?() {
    this.errorCreate = undefined;
  }
  setCurrentTrackingValue(trackingValue: TrackingValueInterface) {
    this.currentTrackingValue = trackingValue;
  }

  openModalCreate() {
    this.displayCreateModal = 'block';
  }

  addTrackingValue(form: NgForm) {
    const trackingValueData: CreateUserTrackingValueInterface = form.value;
    trackingValueData.accountId = parseInt(this.getAccountId());
    if (!this.currentTrackingValue) {
      return;
    }
    trackingValueData.trackingValueId = this.currentTrackingValue!.trackingValueId

    this.profileUserService.createUserTrackingValue(trackingValueData, this.getAccountId()).subscribe(
      (response) => {
        console.log(response);

        this.currentTrackingValue = response;
        this.userTrackingValues?.push(response);
        this.confirmAddedTrackingValue = true;
      },
      (errorMessage) => {
        console.log(errorMessage);

        this.errorCreate = errorMessage;
        this.displayErrorCreate = true;
        this.errorCreate = errorMessage;
      }
    );
    form.reset();
  }

  closeCreateModal() {
    this.currentTrackingValue = undefined;
    this.displayCreateModal = 'none';
    this.confirmAddedTrackingValue = false;
    this.displayErrorCreate = false;
    this.errorCreate = '';
  }

  closeConfirmAddTrackingValue() {
    this.confirmAddedTrackingValue = false;
  }

  closeErrorCreate() {
    this.displayErrorCreate = false;
  }

  //Update

  openEditModal(userTrackingValue: UserTrackingValueInterface) {
    this.currentUserTrackingValue = userTrackingValue;
    this.displayEditModal = 'block';
  }

  updateTrackingValue(form: NgForm) {
    const updatedData: UpdateUserTrackingValueInterface = form.value;
console.log(updatedData);

    this.profileUserService
      .updateUserTrackingValue(this.currentUserTrackingValue!.userTrackingValueId.toString(), updatedData, this.getAccountId())
      .subscribe((response) => {
        console.log(response);
        this.confirmUpdatedTrackingValue = true;
        this.profileUserService
        this.currentUserTrackingValue = response;
        this.ngOnInit();
      },
      (errorMessage) => {
        console.log(errorMessage);
        this.errorUpdated = errorMessage;
        this.displayErrorUpdate = true;
        this.errorUpdated = errorMessage;
      }
    );
  };

  closeEditModal() {
    this.currentTrackingValue = undefined;
    this.currentUserTrackingValue = undefined;
    this.displayEditModal = 'none';
    this.confirmUpdatedTrackingValue = false;
    this.displayErrorUpdate = false;
    this.errorUpdated = '';
  }

  closeConfirmTrackingValueUpdate() {
    this.confirmUpdatedTrackingValue = false;
  }

  closeErrorUpdate() {
    this.displayErrorUpdate = false;
  }

  toAdvancedData() {
    this.router.navigateByUrl(`perfil-paciente/datos-avanzados`)
  }

  ngOnDestroy(): void {
    if(this.userTrackingValuesUsb) {
      this.userTrackingValuesUsb.unsubscribe();
    }

    if(this.trackingValuesUsb) {
      this.trackingValuesUsb.unsubscribe();
    }
    if (this.windowSub) {
      this.windowSub.unsubscribe();
    }
  }

}
