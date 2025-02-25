import { Component, OnDestroy, OnInit } from '@angular/core';
import { SicknessInterface } from '../../../shared/interfaces/sickness.interface';
import { ProfileAdminService } from '../profile-admin.service';
import { Subscription } from 'rxjs';
import { ActivatedRoute, Router } from '@angular/router';
import { NgForm } from '@angular/forms';
import { CreateSicknessInterface } from '../interfaces/create-sickness.interface';
import { UpdateSicknessInterface } from '../../../shared/interfaces/update-sickness.interface';

@Component({
  selector: 'app-sickness-dashboard',
  templateUrl: './sickness-dashboard.component.html',
  styleUrls: ['./sickness-dashboard.component.css'],
})
export class SicknessDashboardComponent implements OnInit, OnDestroy {
  sicknessUsb?: Subscription;
  currentSickness?:SicknessInterface
  noSickness: boolean = false;


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
  filteredItems?: SicknessInterface[];
  allItems?: SicknessInterface[];
  paginatedItems: SicknessInterface[] = [];
  searchText: string = '';

  constructor(
    private adminProfileService: ProfileAdminService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.sicknessUsb = this.adminProfileService
      .getAllSickness()
      .subscribe((sicknesses) => {
        this.filteredItems = sicknesses;
        this.allItems = sicknesses;
        this.totalItems = this.allItems.length;
        if(this.totalItems === 0){
          this.noSickness = true;
        }
        else{
          this.noSickness = false;
        }
        this.paginateItems();
      });
  }

  defaultSicknesses() {
    this.ngOnInit();
    this.noSickness = false;
  }

  // edit
  displayEditSickness(sickness: SicknessInterface) {
    this.displayConfirmEdit = false;
    this.displayErrorEdit = false;
    this.currentSickness = sickness;
    this.showEditModal = 'block'
  }

  editSickness(formEdit:NgForm){
    const sickness:UpdateSicknessInterface = {
      sicknessName: formEdit.value.sicknessName
    }
    this.adminProfileService.editSickness(sickness, this.currentSickness!.sicknessId.toString()).subscribe(
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
  displayDeleteSicknessModal(sickness: SicknessInterface) {
    this.displayErrorDelete = false;
    this.showDeleteModal = 'block'
    this.currentSickness = sickness;
  }
  deleteSickness(){
    this.adminProfileService.deleteSickness(this.currentSickness!.sicknessId.toString()).subscribe(
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


  closeDeleteSickness(){
    this.showDeleteModal = 'none';
  }
  closeErrorDelete(){
    this.displayErrorDelete = false;
  }
  closeConfirmDelete(){
    this.showDeleteConfirmationModal = 'none';
  }


  // create
  displayCreateSicknessModal() {
    this.showCreateModal = 'block'
    this.displayConfirmCreate = false;
    this.displayErrorCreate = false;
  }

  createSickness(form:NgForm){
    const sickness:CreateSicknessInterface = {
      sicknessName: form.value.sicknessName
    }
    this.adminProfileService.createSickness(sickness).subscribe(
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
    this.filteredItems = this.allItems!.filter((sickness) => {
      return sickness.sicknessName!.toLowerCase().includes(this.searchText);
    });

    if (this.filteredItems.length === 0) {
      this.noSickness = true;
    } else {
      this.noSickness = false;
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
    if(this.sicknessUsb){
      this.sicknessUsb.unsubscribe();
    }

  }

}
