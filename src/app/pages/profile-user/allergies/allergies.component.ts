import { Component, OnDestroy, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { AllergyInterface } from '../../../shared/interfaces/allergy.interface';
import { ProfileUserService } from '../profile-user.service';
import { Router } from '@angular/router';
import { SsrCookieService } from 'ngx-cookie-service-ssr';
import { UserAllergyInterface } from '../../../shared/interfaces/user-allergy.interface';
import { SharedService } from '../../../shared/shared.service';
import { CreateUserAllergyInterface } from '../../../shared/interfaces/create-user-allergy.interface';
import { WindowService } from '../../../shared/window.service';

@Component({
  selector: 'app-allergies',
  templateUrl: './allergies.component.html',
  styleUrls: ['./allergies.component.css']
})
export class AllergiesComponent implements OnInit, OnDestroy {
  allergies?: AllergyInterface[];
  allergiesUsb?: Subscription;
  currentAllergy?: AllergyInterface

  userAllergies?: UserAllergyInterface[];
  userAllergiesUsb?: Subscription;
  currentUserAllergy?: UserAllergyInterface;

  displayDeleteModal: string = 'none';

  displayCreateModal: string = 'none';
  confirmAddedAllergy:boolean = false;
  errorCreate:string = '';
  displayErrorCreate:boolean = false;

  isMobile: boolean = false;
  private windowSub?: Subscription;

  constructor(
    private profileUserService: ProfileUserService,
    private sharedService: SharedService,
    private router: Router,
    private cookieService: SsrCookieService,
    private windowService: WindowService
  ) {}

  ngOnInit(): void {
    this.userAllergiesUsb = this.profileUserService
      .getUserAllergiesByAccount(this.getAccountId())
      .subscribe((allergies) => {
        this.userAllergies = allergies;
      });

      this.allergiesUsb = this.sharedService.getAllAllergy().subscribe(allergies => {
        this.allergies = allergies;
      });

      this.windowSub = this.windowService.isMobile$.subscribe((isMobile) => {
        this.isMobile = isMobile;
      });
  }

  getAccountId() {
    return this.cookieService.get('account_id');
  }

  openDeleteModal(userAllergy: UserAllergyInterface) {
    this.currentUserAllergy = userAllergy;
    this.displayDeleteModal = 'block';
  }

  deleteAllergy() {
    this.profileUserService
      .deleteUserAllergy(this.currentUserAllergy!.userAllergyId.toString(), this.getAccountId())
      .subscribe((response) => {
        this.userAllergies! = this.userAllergies!.filter(
          (userAllergy) =>
          userAllergy.userAllergyId !== this.currentUserAllergy!.userAllergyId
        );
        this.currentUserAllergy = undefined;
        this.displayDeleteModal = 'none';
      });
  }

  closeDeleteAllergyModal() {
    this.currentUserAllergy = undefined;
    this.displayDeleteModal = 'none';
  }

  setCurrentAllergy(allergy: AllergyInterface) {
    this.currentAllergy = allergy;
  }

  openModalCreate() {
    this.displayCreateModal = 'block';
  }

  addAllergy() {
    const allergyData: CreateUserAllergyInterface = {
      accountId: parseInt(this.getAccountId()),
      allergyId: this.currentAllergy!.allergyId
    }
    this.profileUserService.createUserAllergy(allergyData, this.getAccountId()).subscribe(
      (response) => {
        this.userAllergies?.push(response);
        this.currentAllergy = undefined;
        this.confirmAddedAllergy = true;
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
    this.currentAllergy = undefined;
    this.displayCreateModal = 'none';
    this.confirmAddedAllergy = false;
    this.displayErrorCreate = false;
    this.errorCreate = '';
  }

  closeConfirmAddAllergy() {
    this.confirmAddedAllergy = false;
  }

  closeErrorCreate() {
    this.displayErrorCreate = false;
  }

  ngOnDestroy(): void {
    if(this.allergiesUsb) {
      this.allergiesUsb.unsubscribe();
    }

    if(this.userAllergiesUsb) {
      this.userAllergiesUsb.unsubscribe();
    }
  }
}
