import { Component, OnDestroy, OnInit } from '@angular/core';
import { SicknessInterface } from '../../../shared/interfaces/sickness.interface';
import { ProfileUserService } from '../profile-user.service';
import { Subscription } from 'rxjs';
import { ActivatedRoute, Router } from '@angular/router';
import { NgForm } from '@angular/forms';
import { SsrCookieService } from 'ngx-cookie-service-ssr';
import { UserSicknessInterface } from '../../../shared/interfaces/user-sickness.interface';
import { MedicationInterface } from '../../../shared/interfaces/medication.interface';
import { SharedService } from '../../../shared/shared.service';
import { MedicationSicknessInterface } from '../../../shared/interfaces/medication-sickness.interface';
import { CreateMedicationSicknessInterface } from '../../../shared/interfaces/create-medication-sickness.interface';
import { CreateUserSicknessInterface } from '../../../shared/interfaces/create-user-sickness.interface';
import { WindowService } from '../../../shared/window.service';

@Component({
  selector: 'app-tracking',
  templateUrl: './tracking.component.html',
  styleUrls: ['./tracking.component.css'],
})
export class TrackingComponent implements OnInit, OnDestroy {
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

  isMobile: boolean = false;
  private windowSub?: Subscription;

  constructor(
    private profileUserService: ProfileUserService,
    private sharedService: SharedService,
    private router: Router,
    private cookieService: SsrCookieService,
    private route: ActivatedRoute,
    private windowService: WindowService
  ) {}

  ngOnInit(): void {
    this.userSicknessesUsb = this.profileUserService
      .getAllUserSicknessByAccount(this.getAccountId())
      .subscribe((sicknesses) => {
        this.userSicknesses = sicknesses;
      });

    this.sicknessesUsb = this.sharedService
      .getAllSickness()
      .subscribe((sicknesses) => {
        this.sicknesses = sicknesses;
      });

    this.medicationsUsb = this.sharedService
      .getAllMedication()
      .subscribe((medications) => {
        this.medications = medications;
      });

    this.windowSub = this.windowService.isMobile$.subscribe((isMobile) => {
      this.isMobile = isMobile;
    });
  }

  getAccountId() {
    return this.cookieService.get('account_id');
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

  ngOnDestroy(): void {
    if (this.userSicknessesUsb) {
      this.userSicknessesUsb.unsubscribe();
    }

    if (this.sicknessesUsb) {
      this.sicknessesUsb.unsubscribe();
    }

    if (this.medicationsUsb) {
      this.medicationsUsb.unsubscribe();
    }
    if (this.windowSub) {
      this.windowSub.unsubscribe();
    }
  }
}
