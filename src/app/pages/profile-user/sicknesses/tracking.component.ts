import { Component, OnDestroy, OnInit } from '@angular/core';
import { SicknessInterface } from '../../../shared/interfaces/sickness.interface';
import { ProfileUserService } from '../profile-user.service';
import { Subscription } from 'rxjs';
import { Router } from '@angular/router';
import { NgForm } from '@angular/forms';
import { SsrCookieService } from 'ngx-cookie-service-ssr';
import { UserSicknessInterface } from '../../../shared/interfaces/user-sickness.interface';
import { MedicationInterface } from '../../../shared/interfaces/medication.interface';
import { SharedService } from '../../../shared/shared.service';
import { MedicationSicknessInterface } from '../../../shared/interfaces/medication-sickness.interface';
import { CreateMedicationSicknessInterface } from '../../../shared/interfaces/create-medication-sickness.interface';
import { CreateUserSicknessInterface } from '../../../shared/interfaces/create-user-sickness.interface';


@Component({
  selector: 'app-tracking',
  templateUrl: './tracking.component.html',
  styleUrls: ['./tracking.component.css'],
})
export class TrackingComponent implements OnInit, OnDestroy {
  sicknesses?: SicknessInterface[];
  sicknessesUsb?: Subscription;
  currentSickness?: SicknessInterface;

  userSicknesses?: UserSicknessInterface[];
  userSicknessesUsb?: Subscription;
  currentUserSickness?: UserSicknessInterface;

  medications?: MedicationInterface[];
  medicationsUsb?: Subscription;
  currentMedication?: MedicationInterface;

  currentMedicationSicknesses?: MedicationSicknessInterface[];

  displayDeleteModal: string = 'none';

  displayCreateModal: string = 'none';
  confirmAddedSickness:boolean = false;
  errorCreate:string = '';
  displayErrorCreate:boolean = false;

  displayEditModal: string = 'none';
  confirmAddMedicine:boolean = false;
  errorAddMedication?: string = undefined;
  confirmDeleteMedicine:boolean = false;
  errorDeleteMedication?: string = undefined;

  constructor(
    private profileUserService: ProfileUserService,
    private sharedService: SharedService,
    private router: Router,
    private cookieService: SsrCookieService
  ) {}

  ngOnInit(): void {
    this.userSicknessesUsb = this.profileUserService
      .getAllUserSicknessByAccount(this.getAccountId())
      .subscribe((sicknesses) => {
        this.userSicknesses = sicknesses;
      });

    this.sicknessesUsb = this.sharedService.getAllSickness().subscribe(sicknesses => {
      this.sicknesses = sicknesses;
    });

    this.medicationsUsb = this.sharedService.getAllMedication().subscribe(medications => {
      this.medications = medications;
    })
  }

  getAccountId() {
    return this.cookieService.get('account_id');
  }

  openDeleteModal(userSickness: UserSicknessInterface) {
    this.currentUserSickness = userSickness;
    this.displayDeleteModal = 'block';
  }

  deleteSickness() {
    this.profileUserService
      .deleteUserSickness(this.currentUserSickness!.userSicknessId.toString(), this.getAccountId())
      .subscribe((response) => {
        this.userSicknesses! = this.userSicknesses!.filter(
          (userSickness) =>
          userSickness.userSicknessId !== this.currentUserSickness!.userSicknessId
        );
        this.currentUserSickness = undefined;
        this.displayDeleteModal = 'none';
      });
  }

  closeDeleteSicknessModal() {
    this.currentUserSickness = undefined;
    this.displayDeleteModal = 'none';
  }

  setCurrentSickness(sickness: SicknessInterface) {
    this.currentSickness = sickness;
  }

  openCreateModal() {
    this.displayCreateModal = 'block';
  }

  addSickness(form: NgForm) {
    const sicknessData: CreateUserSicknessInterface = form.value;
    sicknessData.accountId = parseInt(this.getAccountId());
    sicknessData.sicknessId
    this.profileUserService.createUserSickness(sicknessData, this.getAccountId()).subscribe(
      (response) => {
        this.userSicknesses?.push(response);
        this.currentSickness = undefined;
        this.confirmAddedSickness = true;
      },
      (errorMessage) => {
        console.log(errorMessage);
        this.errorCreate = errorMessage;
        this.displayErrorCreate = true;
        this.errorCreate = errorMessage;
      }
    );
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

  setCurrentMedication(medication: MedicationInterface) {
    this.currentMedication = medication;
  }

  openEditModal(userSickness: UserSicknessInterface) {
    this.currentUserSickness = userSickness;
    this.currentMedicationSicknesses = userSickness.medicationSicknesses;
    this.displayEditModal = 'block';
}

  AddMedication(form: NgForm) {
    const medicationData: CreateMedicationSicknessInterface= form.value;
    medicationData.accountId = parseInt(this.getAccountId());
    medicationData.medicationId = this.currentMedication!.medicationId;
    medicationData.userSicknessId =  this.currentUserSickness!.userSicknessId;
    this.profileUserService.createMedicationSickness(medicationData, this.getAccountId()).subscribe(
      (response) => {
        this.currentUserSickness!.medicationSicknesses.push(response);
        this.currentMedicationSicknesses!.push(response);
        this.currentMedication = undefined;
        this.ngOnInit();
        this.confirmAddMedicine = true;
      },
      (errorMessage) => {
        console.log(errorMessage);
        this.errorAddMedication = errorMessage;
      }
    );
    form.reset();
  }

  handleErrorAddMedication() {
    this.errorAddMedication = undefined;
  }

  closeConfirmAddMedication() {
    this.confirmAddMedicine = false;
  }

  deleteMedication(medicationSicknessId: number) {
    this.profileUserService.deleteMedicationSickness(medicationSicknessId.toString(), this.getAccountId()).subscribe(
      (response) => {
        this.currentUserSickness!.medicationSicknesses = this.currentUserSickness!.medicationSicknesses.filter(medicationSickness => {
          medicationSickness.medicationSicknessId !== medicationSicknessId;
        });
        this.currentMedicationSicknesses! = this.currentMedicationSicknesses!.filter(medicationSickness => {
          medicationSickness.medicationSicknessId !== medicationSicknessId;
        });
        this.ngOnInit();
        this.confirmDeleteMedicine = true;
      },
      (errorMessage) => {
        console.log(errorMessage);
        this.errorDeleteMedication = errorMessage;
      }
    );
  }

  handleErrorDeleteMedication() {
    this.errorDeleteMedication = undefined;
  }

  closeConfirmDeleteMedication() {
    this.confirmDeleteMedicine = false;
  }

  closeEditModal() {
    this.currentMedicationSicknesses = undefined;
    this.currentMedication = undefined;
    this.currentUserSickness = undefined;
    this.displayEditModal = 'none';
    this.confirmAddMedicine = false;
    this.errorDeleteMedication = undefined;
    this.errorAddMedication = undefined;
    this.confirmDeleteMedicine = false;
  }

  goToMedications(slug: string) {
    this.router.navigateByUrl(`perfil-paciente/medicina/${slug}`);
  }

  ngOnDestroy(): void {
    if(this.userSicknessesUsb) {
      this.userSicknessesUsb.unsubscribe();
    }

    if(this.sicknessesUsb) {
      this.sicknessesUsb.unsubscribe();
    }

    if(this.medicationsUsb) {
      this.medicationsUsb.unsubscribe();
    }
  }
}
