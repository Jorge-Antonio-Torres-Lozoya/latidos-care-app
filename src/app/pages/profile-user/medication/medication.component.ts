import { Component, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { ProfileUserService } from '../profile-user.service';
import { ActivatedRoute,Router } from '@angular/router';
import { MedicationInterface } from '../../../shared/interfaces/medication.interface';
import { CreateMedicationInterface } from '../../profile-admin/interfaces/create-medication.interface';
import { NgForm } from '@angular/forms';
import { UpdateMedicationInterface } from '../../../shared/interfaces/update-medication.interface';
import { SicknessInterface } from '../../../shared/interfaces/sickness.interface';
import { SsrCookieService } from 'ngx-cookie-service-ssr';

@Component({
  selector: 'app-medication',
  templateUrl: './medication.component.html',
  styleUrls: ['./medication.component.css'],
})
export class MedicationComponent implements OnInit {
  sicknessId = this.route.snapshot.paramMap.get('sicknessId');
  userId?: string;
  sickness?: SicknessInterface;
  sicknessUsb?: Subscription;
  medications?: MedicationInterface[];
  displayDeleteModal: string = 'none';
  displayCreateModal: string = 'none';
  displayViewMedicationModal: string = 'none';
  displayEditMedicationModal: string = 'none';
  currentMedicationId?: number;
  currentMedication?: MedicationInterface;
  confirmAddMedicine:boolean = false;
  confirmEditMedicine:boolean = false;
  errorAlertMedication?: string = undefined;

  constructor(
    private profileUserService: ProfileUserService,
    private route: ActivatedRoute,
    private router:Router,
    private cookieService: SsrCookieService
  ) {}

  ngOnInit(): void {
    this.userId = this.cookieService.get('user_id')!;
    this.sicknessUsb = this.profileUserService
      .getSicknessById(this.sicknessId!)
      .subscribe((response) => {
        this.sickness = response;
        this.medications = response.medications;
      });
  }
  handleErrorMedication?() {
    this.errorAlertMedication = undefined;
  }

  AddMedication(sicknessId: number, formData: NgForm) {
    if (!formData.value) {
      return;
    }
    const medicationData: CreateMedicationInterface = formData.value;
    medicationData.sicknessId = sicknessId;
    medicationData.userId = Number(this.userId!);
    this.profileUserService
      .createMedication(medicationData)
      .subscribe((response) => {
        this.confirmAddMedicine = true;
        this.profileUserService
          .getSicknessById(this.sicknessId!)
          .subscribe((response) => {
            this.sickness = response;
            this.medications = response.medications;
          });
      },(errorMessage) => {
        console.log(errorMessage);
        this.errorAlertMedication = errorMessage;
      }
      );
      formData.reset();
  }
  deleteUserMedication() {
    this.profileUserService
      .deleteMedication(this.currentMedicationId!.toString())
      .subscribe((response) => {
        this.medications = this.medications!.filter(
          (medication) => medication.medicationId !== this.currentMedicationId
        );
        this.displayDeleteModal = 'none';
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
      .updateMedication(updatedData, this.currentMedicationId!.toString())
      .subscribe((response) => {
        this.confirmEditMedicine = true;
        this.currentMedication = response;
        this.profileUserService.getSicknessById(this.sicknessId!).subscribe((response)=>{
        this.sickness = response;
        this.medications = response.medications;
        });
      });
      formData.reset();
  };

  goToTracking() {
    this.router.navigateByUrl(`profile-user/${this.userId}/tracking`)
  }
  openDeleteModal(medicationId: number) {
    this.currentMedicationId = medicationId;
    this.profileUserService.getMedicationById(medicationId.toString()).subscribe((response)=>{
      this.currentMedication = response;
      this.displayDeleteModal = 'block';
    })
  }

  openViewModal(medicationId: number) {
    this.currentMedicationId = medicationId;
    this.profileUserService.getMedicationById(medicationId.toString()).subscribe((response) => {
      this.currentMedication = response;

      this.displayViewMedicationModal = 'block';
    });
  }
  openEditModal(idSickness: number) {
    this.currentMedicationId = idSickness;
    this.profileUserService.getMedicationById(idSickness.toString()).subscribe((response)=>{
      this.currentMedication = response;
      this.displayEditMedicationModal = 'block';


    })
  }

  OpenModalCreateMedication() {
    this.displayCreateModal = 'block';
  }
  closeDeleteMedicationModal() {
    this.displayDeleteModal = 'none';
  }
  closeCreateModal() {
    this.displayCreateModal = 'none';
  }
  closeEditModal() {
    this.displayEditMedicationModal = 'none';
  }
  closeViewMedicationModal(){
    this.displayViewMedicationModal = 'none';
  }

  closeConfirmAddMedication() {
    this.confirmAddMedicine = false;
  }

  closeConfirmEditMedicine() {
    this.confirmEditMedicine = false;
  }
}
