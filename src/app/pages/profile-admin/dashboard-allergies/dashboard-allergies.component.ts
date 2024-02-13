import { Component, OnDestroy, OnInit } from '@angular/core';
import { AllergyInterface } from '../../../shared/interfaces/allergy.interface';
import { Subscription } from 'rxjs';
import { ProfileAdminService } from '../profile-admin.service';
import { NgForm } from '@angular/forms';
import { CreateAllergyInterface } from '../interfaces/create-allergy.interface';
import { DatePipe } from '@angular/common';
import { UpdateAllergyInterface } from '../../../shared/interfaces/update-allergy.interface';


@Component({
  selector: 'app-dashboard-allergies',
  templateUrl: './dashboard-allergies.component.html',
  styleUrls: ['./dashboard-allergies.component.css']
})
export class DashboardAllergiesComponent implements OnInit, OnDestroy {
  allergiesUsb?: Subscription;
  currentAllergy?: AllergyInterface;

  noAllergies:boolean = false;
  currentPage: number = 1;
  itemsPerPage: number = 10;
  totalItems: number = 0
  filteredItems?: AllergyInterface[];
  allItems?: AllergyInterface[];
  paginatedItems: AllergyInterface[] = [];
  searchText:string = '';

  showEditModal:string = 'none';
  displayConfirmEdit:boolean = false;
  errorEdit:string = '';
  displayErrorEdit:boolean = false;

  showDeleteModal:string = 'none';
  errorDelete:string = '';
  displayErrorDelete:boolean = false;
  showDeleteConfirmationModal:string = 'none';


  showCreateModal:string = 'none';
  displayConfirmCreate:boolean = false;
  errorCreate:string = '';
  displayErrorCreate:boolean = false;






  constructor(private profileAdminService:ProfileAdminService,private datePipe: DatePipe) { }

  ngOnInit(): void {
    this.allergiesUsb = this.profileAdminService.getAllAllergies().subscribe(allergies => {
      this.filteredItems = allergies;
      this.allItems = allergies;
      this.totalItems = this.allItems.length;
      if(this.totalItems === 0){
        this.noAllergies = true;
      }
      else{
        this.noAllergies = false;
      }
      this.paginateItems();
    });
  }
  filter(form:NgForm) {
    this.searchText = form.value.searchText.toLowerCase();
    this.filteredItems = this.allItems!.filter(allergy => {return allergy.allergyName!.toLowerCase().includes(this.searchText)});

      if(this.filteredItems.length === 0) {
        this.noAllergies = true;
      } else {
        this.noAllergies = false;
      }

        this.totalItems = this.filteredItems.length;
        this.paginatedItems = this.filteredItems;
        this.paginateItems();
        this.searchText = '';
        this.currentPage = 1;

    }

  paginateItems(): void {
    const startIndex = (this.currentPage - 1) * this.itemsPerPage;
    const endIndex = startIndex + this.itemsPerPage;
    this.paginatedItems = this.filteredItems?.slice(startIndex, endIndex) || [];
  }

  defaultAllergies(): void {
    this.ngOnInit();
    this.noAllergies = false;
  }

  // Edit

  displayEditAllergy(allergy:AllergyInterface){
    this.displayConfirmEdit = false;
    this.displayErrorEdit = false;
    this.currentAllergy = allergy;
    this.showEditModal = 'block'

  }
  editAllergy(formEdit:NgForm){
    const allergy:UpdateAllergyInterface = {
      allergyName: formEdit.value.allergyName
    }
    this.profileAdminService.editAllergy(allergy, this.currentAllergy!.allergyId.toString()).subscribe(
      (response) => {
        this.displayConfirmEdit = true;
        this.displayErrorEdit = false;
        this.ngOnInit();
      },
      (error) => {
        this.errorEdit = error;
        this.displayErrorEdit = true;
        this.displayConfirmEdit = false;
      }
    )


  }

  closeEditModal(){
    this.showEditModal = 'none';
  }
  closeConfirmEdit(){
    this.displayConfirmEdit = false;
  }
  closeErrorEdit(){
    this.displayErrorEdit = false;
  }

  // delete allergy
  displayDeleteAllergyModal(allergy:AllergyInterface){
    this.displayErrorDelete = false;
    this.showDeleteModal = 'block'
    this.currentAllergy = allergy;
  }
  closeDeleteAllergy(){
    this.showDeleteModal = 'none';
  }
  closeErrorDelete(){
    this.displayErrorDelete = false;
  }
  closeConfirmDelete(){
    this.showDeleteConfirmationModal = 'none';
  }

  deleteAllergy(){
    this.profileAdminService.deleteAllergy(this.currentAllergy!.allergyId.toString()).subscribe(
      (response) => {
        this.showDeleteModal = 'none';
        this.showDeleteConfirmationModal = 'block';
        this.displayErrorDelete = false;
        this.ngOnInit();
      },
      (error) => {
        this.errorDelete = error;
        this.displayErrorDelete = true;

      }
    )
  }

// create allergy
  displayCreateAllergyModal(){
    this.showCreateModal = 'block'
    this.displayConfirmCreate = false;
    this.displayErrorCreate = false;
  }

  createAllergy(form:NgForm){
    const allergy:CreateAllergyInterface = {
      allergyName: form.value.allergyName
    }
    this.profileAdminService.createAllergy(allergy).subscribe(
      (response) => {
        this.displayConfirmCreate = true;
        this.ngOnInit();
      },
      (error) => {
        this.errorCreate = error;
        this.displayErrorCreate = true;
      }
    )
    form.reset();
  }

  closeCreateModal(){
    this.showCreateModal = 'none';

  }

  closeErrorCreate(){
    this.displayErrorCreate = false;
  }
  closeConfirmCreate(){
    this.displayConfirmCreate = false;
  }

  closeDeleteModal(){
    this.showDeleteModal = 'none';
  }


  // pagination
  changePage(newPage: number, event: Event): void {
    event.preventDefault();
    this.currentPage = newPage;
    this.paginateItems();
  }
  get displayedPages(): number[] {
    const totalPages = this.totalPages;
    const currentPage = this.currentPage;
    let startPage: number;
    let endPage: number;

    if (totalPages <= 4) {
      // Less than 4 total pages, show all
      startPage = 1;
      endPage = totalPages;
    } else {
      // More than 4 total pages, calculate start and end pages
      if (currentPage <= 2) {
        startPage = 1;
        endPage = 4;
      } else if (currentPage + 2 >= totalPages) {
        startPage = totalPages - 3;
        endPage = totalPages;
      } else {
        startPage = currentPage - 1;
        endPage = currentPage + 2;
      }
    }

    return Array.from(Array((endPage + 1) - startPage).keys()).map(i => startPage + i);
  }
  get totalPages(): number {
    return Math.ceil(this.totalItems / this.itemsPerPage);
  }


  ngOnDestroy(): void {
    if(this.allergiesUsb){
      this.allergiesUsb.unsubscribe()
    }
  }


}
