import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot, UrlTree } from '@angular/router';
import { Observable, first, map, take } from 'rxjs';
import { LoginAdminService } from '../../pages/login-admin/login-admin.service';

@Injectable({
  providedIn: 'root'
})
export class AdminGuard implements CanActivate {
  constructor( private router: Router, private loginAdminService:LoginAdminService){}
  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean | UrlTree | Observable<boolean | UrlTree> | Promise<boolean | UrlTree> {
    return this.loginAdminService.admin!.pipe(take(1) ,map(
      admin => {
        if (admin === null) {
          console.log('user is null', admin)
          return true;
        }
        const isAuthorized:boolean = !!admin
        if(isAuthorized){
          return true
        } else {
          this.router.navigate(['unauthorized']);
          return false;
        }
      }
    ))
  }

}
