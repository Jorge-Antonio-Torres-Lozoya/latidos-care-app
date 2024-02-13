import { Component, OnDestroy, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { TrackingValueInterface } from '../../../shared/interfaces/tracking-value.interface';
import { ProfileAdminService } from '../profile-admin.service';
import { Router } from '@angular/router';
import { NgForm } from '@angular/forms';
import { CreateTrackingValueInterface } from '../interfaces/create-tracking-value.interface';
import { UpdateTrackingValueInterface } from '../../../shared/interfaces/update-tracking-value.interface';

@Component({
  selector: 'app-dashboard-tracking-values',
  templateUrl: './dashboard-tracking-values.component.html',
  styleUrls: ['./dashboard-tracking-values.component.css']
})
export class DashboardTrackingValuesComponent implements OnInit, OnDestroy{
  trackingValueUsb?: Subscription;
  currentTrackingValue?:TrackingValueInterface
  noTrackingValues: boolean = false;


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
  filteredItems?: TrackingValueInterface[];
  allItems?: TrackingValueInterface[];
  paginatedItems: TrackingValueInterface[] = [];
  searchText: string = '';

  constructor(
    private adminProfileService: ProfileAdminService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.trackingValueUsb = this.adminProfileService
      .getAllTrackingValues()
      .subscribe((trackingValues) => {
        this.filteredItems = trackingValues;
        this.allItems = trackingValues;
        this.totalItems = this.allItems.length;
        console.log(this.totalItems);
        if(this.totalItems === 0){
          this.noTrackingValues = true;
        }
        else{
          this.noTrackingValues = false;
        }
        this.paginateItems();
      });
  }

  defaultTrackingValues() {
    this.ngOnInit();
    this.noTrackingValues = false;
  }

  // edit
  displayEditTrackingValue(TrackingValue: TrackingValueInterface) {
    this.displayConfirmEdit = false;
    this.displayErrorEdit = false;
    this.currentTrackingValue = TrackingValue;
    this.showEditModal = 'block'
  }

  editTrackingValue(formEdit:NgForm){
    const trackingValue:UpdateTrackingValueInterface = {
      trackingValueName: formEdit.value.trackingValueName
    }
    this.adminProfileService.editTrackingValue(trackingValue, this.currentTrackingValue!.trackingValueId.toString()).subscribe(
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
  displayDeleteTrackingValueModal(TrackingValue: TrackingValueInterface) {
    this.displayErrorDelete = false;
    this.showDeleteModal = 'block'
    this.currentTrackingValue = TrackingValue;
  }
  deleteTrackingValue(){
    this.adminProfileService.deleteTrackingValue(this.currentTrackingValue!.trackingValueId.toString()).subscribe(
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


  closeDeleteTrackingValue(){
    this.showDeleteModal = 'none';
  }
  closeErrorDelete(){
    this.displayErrorDelete = false;
  }
  closeConfirmDelete(){
    this.showDeleteConfirmationModal = 'none';
  }


  // create
  displayCreateTrackingValueModal() {
    this.showCreateModal = 'block'
    this.displayConfirmCreate = false;
    this.displayErrorCreate = false;
  }

  createTrackingValue(form:NgForm){
    const TrackingValue:CreateTrackingValueInterface = {
      trackingValueName: form.value.trackingValueName
    }
    this.adminProfileService.createTrackingValue(TrackingValue).subscribe(
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
    this.filteredItems = this.allItems!.filter((trackingValueName) => {
      return trackingValueName.trackingValueName!.toLowerCase().includes(this.searchText);
    });

    if (this.filteredItems.length === 0) {
      this.noTrackingValues = true;
    } else {
      this.noTrackingValues = false;
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
    if(this.trackingValueUsb){
      this.trackingValueUsb.unsubscribe()
    }
  }
}
