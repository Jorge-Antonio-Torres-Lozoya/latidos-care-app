import { Component, OnInit } from '@angular/core';
import { SicknessInterface } from '../../../shared/interfaces/sickness.interface';
import { ProfileUserService } from '../profile-user.service';
import { Observable, Subscription, switchMap } from 'rxjs';
import { Router } from '@angular/router';
import { NgForm } from '@angular/forms';
import { CreateMedicationInterface } from '../../../shared/interfaces/create-medication.interface';
import { CreateSicknessInterface } from '../../../shared/interfaces/create-sickness.interface';
import { UpdateSicknessInterface } from '../../../shared/interfaces/update-sickness.interface';
import { SsrCookieService } from 'ngx-cookie-service-ssr';

@Component({
  selector: 'app-tracking',
  templateUrl: './tracking.component.html',
  styleUrls: ['./tracking.component.css'],
})
export class TrackingComponent implements OnInit {
  userId?: string;
  userUsb?: Subscription;
  sicknesses?: SicknessInterface[];
  sicknessesUsb?: Subscription;
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

  constructor(
    private profileUserService: ProfileUserService,
    private router: Router,
    private cookieService: SsrCookieService
  ) {}

  ngOnInit(): void {
    this.userId = this.cookieService.get('user_id')!;
    this.userUsb = this.profileUserService
      .getAllSicknessByUser(this.userId!)
      .subscribe((sicknesses) => {
        this.sicknesses = sicknesses;
      });
  }

  handleError?() {
    this.errorAlert = undefined;
  }
  handleErrorMedication?() {
    this.errorAlertMedication = undefined;
  }

  getSicknessById(idSickness: number): Observable<any> {
    this.currentSicknessId = idSickness;
    return this.profileUserService
      .getSicknessById(this.currentSicknessId!.toString())
      .pipe(
        switchMap((sicknessById) => {
          this.sicknessById = sicknessById;
          return new Observable((observer) => {
            observer.next();
            observer.complete();
          });
        })
      );
  }

  deleteSickness() {
    this.profileUserService
      .deleteSickness(this.currentSicknessId!.toString())
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
    sicknessData.userId = Number(this.userId!);
    this.profileUserService.createSickness(sicknessData).subscribe(
      (response) => {
        this.confirmAddedSickness = true;
        this.profileUserService
          .getAllSicknessByUser(this.userId!)
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
      .editSickness(updatedData, this.currentSicknessId!.toString())
      .subscribe((response) => {
        this.confirmUpdatedSickness = true;
        this.profileUserService
        .getAllSicknessByUser(this.userId!)
        .subscribe((sicknesses) => {
          this.sicknesses = sicknesses;
          this.profileUserService.getSicknessById(this.currentSicknessId!.toString()).subscribe((response)=>{
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
    medicationData.userId = Number(this.userId!);
    this.profileUserService.createMedication(medicationData).subscribe(
      (response) => {
        this.confirmAddMedicine = true;
        this.profileUserService
          .getAllSicknessByUser(this.userId!)
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
  goToMedications(sicknessId: number) {
    this.router.navigateByUrl(`profile-user/${this.userId}/medication/${sicknessId}`);
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
    this.profileUserService.getSicknessById(idSickness.toString()).subscribe((response)=>{
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
}
