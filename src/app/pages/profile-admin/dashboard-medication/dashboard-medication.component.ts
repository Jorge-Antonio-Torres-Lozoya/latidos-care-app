import { Component, OnDestroy, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { MedicationInterface } from '../../../shared/interfaces/medication.interface';
import { NgForm } from '@angular/forms';
import { UpdateMedicationInterface } from '../../../shared/interfaces/update-medication.interface';
import { ProfileAdminService } from '../profile-admin.service';
import { Router } from '@angular/router';
import { CreateMedicationInterface } from '../interfaces/create-medication.interface';

@Component({
  selector: 'app-dashboard-medication',
  templateUrl: './dashboard-medication.component.html',
  styleUrls: ['./dashboard-medication.component.css']
})
export class DashboardMedicationComponent implements OnInit, OnDestroy {
  medicationUsb?: Subscription;
  currentMedication?:MedicationInterface
  noMedication: boolean = false;


  showEditModal: string = 'none';
  displayConfirmEdit: boolean = false;
  errorEdit: string = '';
  displayErrorEdit: boolean = false;

  showDeleteModal: string = 'none';
  errorDelete: string = '';
  displayErrorDelete: boolean = false;
  showDeleteConfirmationModal: string = 'none';

  showCreateModal: string = 'none';
  displayConfirmCreate: boolean = false;
  errorCreate: string = '';
  displayErrorCreate: boolean = false;

  currentPage: number = 1;
  itemsPerPage: number = 10;
  totalItems: number = 0;
  filteredItems?: MedicationInterface[];
  allItems?: MedicationInterface[];
  paginatedItems: MedicationInterface[] = [];
  searchText: string = '';

  constructor(
    private adminProfileService: ProfileAdminService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.medicationUsb = this.adminProfileService
      .getAllMedications()
      .subscribe((medicines) => {
        this.filteredItems = medicines;
        this.allItems = medicines;
        this.totalItems = this.allItems.length;
        if(this.totalItems === 0){
          this.noMedication = true;
        }
        else{
          this.noMedication = false;
        }
        this.paginateItems();
      });
  }

  defaultMedications() {
    this.ngOnInit();
    this.noMedication = false;
  }

  // edit
  displayEditMedication(Medication: MedicationInterface) {
    this.displayConfirmEdit = false;
    this.displayErrorEdit = false;
    this.currentMedication = Medication;
    this.showEditModal = 'block'
  }

  editMedication(formEdit:NgForm){
    const Medication:UpdateMedicationInterface = {
      medicationName: formEdit.value.medicationName
    }
    this.adminProfileService.editMedication(Medication, this.currentMedication!.medicationId.toString()).subscribe(
      (response) => {
        this.displayConfirmEdit = true;
        this.displayErrorEdit = false;
        this.ngOnInit();
      },
      (error) => {
        this.errorEdit = error;
        this.displayErrorEdit = true;
        this.displayConfirmEdit = false;
      })
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


  // delete
  displayDeleteMedicationModal(Medication: MedicationInterface) {
    this.displayErrorDelete = false;
    this.showDeleteModal = 'block'
    this.currentMedication = Medication;
  }
  deleteMedication(){
    this.adminProfileService.deleteMedication(this.currentMedication!.medicationId.toString()).subscribe(
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


  closeDeleteMedication(){
    this.showDeleteModal = 'none';
  }
  closeErrorDelete(){
    this.displayErrorDelete = false;
  }
  closeConfirmDelete(){
    this.showDeleteConfirmationModal = 'none';
  }


  // create
  displayCreateMedicationModal() {
    this.showCreateModal = 'block'
    this.displayConfirmCreate = false;
    this.displayErrorCreate = false;
  }

  createMedication(form:NgForm){
    const Medication:CreateMedicationInterface = {
      medicationName: form.value.medicationName
    }
    this.adminProfileService.createMedication(Medication).subscribe(
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

  closeErrorCreate() {
    this.displayErrorCreate = false;
  }

  closeConfirmCreate() {
    this.displayConfirmCreate = false;
  }

  closeCreateModal() {
    this.showCreateModal = 'none';
  }

  filter(form: NgForm) {
    this.searchText = form.value.searchText.toLowerCase();
    this.filteredItems = this.allItems!.filter((medication) => {
      return medication.medicationName!.toLowerCase().includes(this.searchText);
    });

    if (this.filteredItems.length === 0) {
      this.noMedication = true;
    } else {
      this.noMedication = false;
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

  ngOnDestroy(): void{
    if(this.medicationUsb){
      this.medicationUsb.unsubscribe();
    }

  }

}


