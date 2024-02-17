import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AccountInterface } from '../../shared/interfaces/account.interface';
import { Subscription } from 'rxjs';
import { LoginService } from '../../pages/login/login.service';
import { SsrCookieService } from 'ngx-cookie-service-ssr';
import { SharedService } from '../../shared/shared.service';
import { UpdateAccountInterface } from '../../shared/interfaces/update-account.interface';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css']
})
export class NavbarComponent implements OnInit, OnDestroy {
  accountConnected: boolean = false;
  accountId?: string;
  account?: AccountInterface;
  private accountConnectedUsb?:Subscription;
  private accountUsb?:Subscription;
  private accountRoleUsb?:Subscription;
  activeRole?: string = this.getAccountRole();
  adminRole: boolean = false;
  logoutModal:string = 'none';

  constructor(
    private router: Router,
    private loginService: LoginService,
    private cookieService: SsrCookieService,
    private sharedService: SharedService
    ) { }

    ngOnInit(): void {
      this.accountConnectedUsb = this.loginService.account!.subscribe((account) => {
        this.accountConnected = !!account;
        if(this.accountConnected) {
          this.accountId = this.cookieService.get('account_id');
          this.accountUsb = this.sharedService.getAccountById(this.getAccountId()).subscribe((account) => {
            this.account = account;
            this.hasAdminRole();
          });
        }
      });
    }

    getAccountId() {
      return this.cookieService.get('account_id');
    }

    getAccountRole() {
      return this.cookieService.get('account-role');
    }

    hasAdminRole() {
      this.adminRole = this.account!.roles!.some(roleAccount => roleAccount.role!.roleName === 'Admin');
    }

    forceNavigate(name: string) {
      this.router.navigate(['/'], { fragment: name });
    }

    toAdmin() {
      const accountData: UpdateAccountInterface = {activeRole: 'Admin'}
      this.sharedService.updateAccount(this.accountId!, accountData).subscribe(account => {
        this.loginService.activeRole.next('Admin');
        this.activeRole = account.activeRole;
        this.cookieService.set('account-role', 'Admin');
        this.router.navigate([`/privado/administrador`])
      })
    }

    toRegisterAdmin() {
      this.router.navigate([`/privado/administrador/registro-administrador`]);
    }

    toAccount() {
      this.router.navigate([`/privado/administrador/panel-cuentas`]);
    }

    toValues() {
      this.router.navigate([`/privado/administrador/panel-valores-laboratorio`]);
    }

    toSickness() {
      this.router.navigate([`/privado/administrador/panel-enfermedades`]);
    }

    toAllergy() {
      this.router.navigate([`/privado/administrador/panel-alergias`]);
    }

    toMedicine() {
      this.router.navigate([`/privado/administrador/panel-medicinas`]);
    }

    toProfile() {
      if(this.activeRole === 'Admin') {
        const accountData: UpdateAccountInterface = {activeRole: 'User'}
        this.sharedService.updateAccount(this.accountId!, accountData).subscribe(account => {
          this.loginService.activeRole.next('User');
          this.activeRole = account.activeRole;
          this.cookieService.set('account-role', 'User');
          this.router.navigate([`/perfil-paciente/ajustes`]);
        })
      } else if(this.activeRole === 'User') {
        this.router.navigate([`/perfil-paciente/ajustes`]);
      }
    }

    navigateToHome() {
      if(!this.accountConnected) {
        this.router.navigateByUrl(`/`);
      } else {
       this.router.navigate([`/perfil-paciente`]);
      }
    }

    logOut() {
      this.loginService.logOutAccount();
      this.loginService.account!.next(null);
      this.accountConnected = false;
      this.activeRole = undefined;
      this.router.navigate(['/login']);
    }

    logoutDisplayModal() {
      this.logoutModal = 'block';
    }

    logoutHideModal() {
      this.logoutModal = 'none';
    }

    ngOnDestroy(): void {
      if(this.accountUsb) {
        this.accountUsb.unsubscribe();
      }

      if(this.accountConnectedUsb) {
        this.accountConnectedUsb.unsubscribe();
      }
    }
}


