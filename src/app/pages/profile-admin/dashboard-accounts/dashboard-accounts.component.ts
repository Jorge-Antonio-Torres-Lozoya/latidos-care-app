import { Component, OnDestroy, OnInit } from '@angular/core';
import { ProfileAdminService } from '../profile-admin.service';
import { Subscription } from 'rxjs';
import { AccountInterface } from '../../../shared/interfaces/account.interface';
import { RoleInterface } from '../../../shared/interfaces/role.interface';
import { NgForm } from '@angular/forms';
import { AddRoleToAccount } from '../interfaces/add-role-to-account.interface';

@Component({
  selector: 'app-dashboard-accounts',
  templateUrl: './dashboard-accounts.component.html',
  styleUrls: ['./dashboard-accounts.component.css']
})
export class DashboardAccountsComponent implements OnInit, OnDestroy{
  constructor(private profileAdminService:ProfileAdminService) { }
  accountUsb?: Subscription;
  currentAccount?: AccountInterface;
  noAccounts:boolean = false;

  currentPage: number = 1;
  itemsPerPage: number = 10;
  totalItems: number = 0
  filteredItems?: AccountInterface[];
  allItems?: AccountInterface[];
  paginatedItems: AccountInterface[] = [];
  searchText:string = '';

  roles?:RoleInterface[];
  rolesUsb?: Subscription;
  currentRole?: RoleInterface;
  currentRoleModal?: RoleInterface;

  showDeleteModal:string = 'none';
  displayConfirmDelete:string = 'none';
  errorDelete:string = '';
  displayErrorDelete:boolean = false;

  // edit
  showEditModal:string = 'none';
  displayConfirmEdit:boolean = false;
  errorEdit:string = '';
  displayErrorEdit:boolean = false;
  userRoles: RoleInterface[] = [];
  currentRoleAccount?: RoleInterface;
  userRoleNames: string[] = [];

  ngOnInit(): void {
    this.accountUsb = this.profileAdminService.getAllAccounts().subscribe(accounts => {
      this.filteredItems = accounts;
      this.allItems = accounts;
      this.totalItems = this.allItems.length;
      if(this.totalItems === 0){
        this.noAccounts = true;
      }
      else{
        this.noAccounts = false;
      }
      this.paginateItems();
    });
    this.rolesUsb = this.profileAdminService.getAllRoles().subscribe(roles => {
      this.roles = roles;
    })
  }
  paginateItems(): void {
    const startIndex = (this.currentPage - 1) * this.itemsPerPage;
    const endIndex = startIndex + this.itemsPerPage;
    this.paginatedItems = this.filteredItems?.slice(startIndex, endIndex) || [];
  }

  filterAccount(form:NgForm) {
    this.searchText = form.value.searchText.toLowerCase();
    this.filteredItems = this.allItems!.filter(account => {return account.firstName!.toLowerCase().includes(this.searchText)});

      if(this.filteredItems.length === 0) {
        this.noAccounts = true;
      } else {
        this.noAccounts = false;
      }

        this.totalItems = this.filteredItems.length;
        this.paginatedItems = this.filteredItems;
        this.paginateItems();
        this.searchText = '';
        this.currentPage = 1;
        form.reset();
  }

  // Search
  filterByRole(role: RoleInterface) {
    this.accountUsb = this.profileAdminService.getAllAccountsByRole(role.roleName).subscribe(accounts => {
      this.filteredItems = accounts;
      if(this.filteredItems!.length === 0) {
        this.noAccounts = true;
      } else {
        this.noAccounts = false;
      }
      this.totalItems = this.filteredItems.length;
      this.paginatedItems = accounts;
      this.currentPage = 1;
      this.paginateItems();
    });
  }

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


  defaultAccounts() {
    this.ngOnInit();
    this.noAccounts = false;
  }

  returnRolesName(account: AccountInterface) {
    const rolesName:string[] = account.roles!.map(roleAccount => {return roleAccount.role!.roleName!});
    return rolesName;
  }

  displayDeleteAccountModal(account: AccountInterface) {
    this.displayErrorDelete=false;
    this.currentAccount = account;
    this.showDeleteModal = 'block';

  }
  displayEditWorkModal(account: AccountInterface) {
    this.displayConfirmEdit = false;
    this.displayErrorEdit = false;
    this.showEditModal = 'block'
    this.currentAccount = account;
    this.userRoles = account.roles!.map((roleAccount) => roleAccount.role!);
    this.userRoleNames = account.roles!.map(roleAccount => {return roleAccount.role!.roleName!});
  }


  deleteAccount() {
    this.profileAdminService.deleteAccount(this.currentAccount?.accountId.toString()!).subscribe(account => {
      this.ngOnInit();
      this.showDeleteModal = 'none';
      this.displayConfirmDelete = 'block';
    }, errorMessage => {

      this.errorDelete = errorMessage
      this.displayErrorDelete = true;
    });
  }

  closeDeleteAccount(){
    this.showDeleteModal = 'none';
    this.currentAccount = undefined;
  }
  closeConfirmDelete() {
    this.displayConfirmDelete = 'none';
    this.currentAccount = undefined;
  }
  closeErrorDelete(){
    this.displayErrorDelete = false;
  }

  // edit
  closeEditAccount() {
    this.showEditModal = 'none';
    this.currentAccount = undefined;
    this.userRoles = [];
    this.currentRole = undefined;
    this.currentRoleModal = undefined;
    this.currentRoleAccount = undefined;

  }

  selectCurrentRole(role: RoleInterface) {
    this.currentRoleModal = role;
  }
  selectCurrentRoleAccount(role: RoleInterface) {
    this.currentRoleAccount = role;
  }

  addRole(){
    const roleName= this.currentRoleModal?.roleName;
    const roleData: AddRoleToAccount = {roleName: roleName!};
    this.profileAdminService.addRoleToAccount(roleData, this.currentAccount!.accountId.toString()).subscribe(account => {
      this.currentAccount = account;
      this.userRoleNames = account.roles!.map(roleAccount => {return roleAccount.role!.roleName!});
      this.userRoles = account.roles!.map((roleAccount) => roleAccount.role!);
      this.ngOnInit();
      this.displayConfirmEdit = true;
    }, errorMessage => {

      this.errorEdit = errorMessage
      this.displayErrorEdit = true;
    });
  }

  removeRole() {
    // this.editSpinner = true;
    const roleName = this.currentRoleAccount!.roleName;
    const roleData: AddRoleToAccount = {roleName}
    this.profileAdminService.removeRoleToAccount(roleData, this.currentAccount!.accountId.toString()).subscribe(account => {
      this.currentAccount = account;
      this.userRoleNames = account.roles!.map(roleAccount => {return roleAccount.role!.roleName!});
      this.userRoles = account.roles!.map((roleAccount) => roleAccount.role!);
      this.ngOnInit();
      this.displayConfirmEdit = true;
    }, errorMessage => {

      this.errorEdit = errorMessage
      this.displayErrorEdit = true;
    });
  }

  activateAccount() {
    // this.editSpinner = true;
    this.profileAdminService.activateAccount(this.currentAccount!.accountId.toString()).subscribe(account => {
      this.currentAccount = account;
      this.displayConfirmEdit = true;
      this.ngOnInit();
    }, errorMessage => {

      this.errorEdit = errorMessage
      this.displayErrorEdit = true;
    })
  }

  deactivateAccount() {
    this.profileAdminService.deactivateAccount(this.currentAccount!.accountId.toString()).subscribe(account => {
      this.currentAccount = account;
      this.displayConfirmEdit = true;
      this.ngOnInit();
    }, errorMessage => {

      this.errorEdit = errorMessage
      this.displayErrorEdit = true;
    })
  }

  closeConfirmEdit() {
    this.displayConfirmEdit = false;
  }
  closeErrorEdit() {
    this.displayErrorEdit = false;
  }

  ngOnDestroy(): void {
    if(this.accountUsb) {
      this.accountUsb.unsubscribe();
    }
    if(this.rolesUsb) {
      this.rolesUsb.unsubscribe();
    }

  }

}
