import { Component } from '@angular/core';
import { Observable, Subscription, switchMap } from 'rxjs';
import { AllergyInterface } from '../../../shared/interfaces/allergy.interface';
import { ProfileUserService } from '../profile-user.service';
import { Router } from '@angular/router';
import { NgForm } from '@angular/forms';
import { CreateAllergyInterface } from '../../../shared/interfaces/create-allergy.interface';
import { UpdateAllergyInterface } from '../../../shared/interfaces/update-allergy.interface';
import { SsrCookieService } from 'ngx-cookie-service-ssr';

@Component({
  selector: 'app-allergies',
  templateUrl: './allergies.component.html',
  styleUrls: ['./allergies.component.css']
})
export class AllergiesComponent {
  userId?: string;
  userUsb?: Subscription;
  allergies?: AllergyInterface[];
  allergiesUsb?: Subscription;
  allergyById?: AllergyInterface
  displayDeleteModal: string = 'none';
  displayCreateModal: string = 'none';
  displayViewModal: string = 'none';
  displayEditModal: string = 'none';
  currentAllergyId?: number;
  currentAllergy?: AllergyInterface;
  confirmAddedAllergy:boolean = false;
  confirmUpdatedAllergy:boolean = false;
  errorAlert?: string = undefined;

  constructor(
    private profileUserService: ProfileUserService,
    private router: Router,
    private cookieService: SsrCookieService
  ) {}

  ngOnInit(): void {
    this.userId = this.cookieService.get('user_id')!;
    this.userUsb = this.profileUserService
      .getAllergiesByUser(this.userId!)
      .subscribe((allergies) => {
        this.allergies = allergies;
      });
  }

  handleError?() {
    this.errorAlert = undefined;
  }

  getAllergyById(idAllergy: number): Observable<any> {
    this.currentAllergyId = idAllergy;
    return this.profileUserService
      .getAllergyById(this.currentAllergyId!.toString())
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
      .deleteAllergy(this.currentAllergyId!.toString())
      .subscribe((response) => {
        this.allergies = this.allergies!.filter(
          (allergy) =>
          allergy.allergyId !== this.currentAllergyId
        );
        this.displayDeleteModal = 'none';
      });
  }

  addAllergy(form: NgForm) {
    const allergyData: CreateAllergyInterface = form.value;
    allergyData.userId = Number(this.userId!);
    this.profileUserService.createAllergy(allergyData).subscribe(
      (response) => {
        this.confirmAddedAllergy = true;
        this.profileUserService
          .getAllergiesByUser(this.userId!)
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
      .updateAllergy(updatedData, this.currentAllergyId!.toString())
      .subscribe((response) => {
        this.confirmUpdatedAllergy = true;
        this.profileUserService
        .getAllergiesByUser(this.userId!)
        .subscribe((allergies) => {
          this.allergies = allergies;
          this.profileUserService.getAllergyById(this.currentAllergyId!.toString()).subscribe((response)=>{
            this.currentAllergy = response;
          });
        });
      });
  };

  closeDeleteAllergyModal() {
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

  openDeleteModal(idAllergy: number) {
    this.currentAllergyId = idAllergy;
    this.getAllergyById(idAllergy).subscribe(() => {
      this.displayDeleteModal = 'block';
    });
  }
  openViewModal(idAllergy: number) {
    this.currentAllergyId = idAllergy;
    this.getAllergyById(idAllergy).subscribe(() => {
      this.displayViewModal = 'block';
    });
  }
  openEditModal(idAllergy: number) {
    this.currentAllergyId = idAllergy;
    this.profileUserService.getAllergyById(idAllergy.toString()).subscribe((response)=>{
      this.currentAllergy = response;
      this.displayEditModal = 'block';
    });
  }

  closeConfirmAllergyUpdate() {
    this.confirmUpdatedAllergy = false;
  }

  closeConfirmAddAllergy() {
    this.confirmAddedAllergy = false;
  }

}
