import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot, UrlTree } from '@angular/router';
import { Observable, first, map, take } from 'rxjs';
import { LoginService } from '../../pages/login/login.service';


@Injectable({
  providedIn: 'root'
})

export class AdminGuard  implements CanActivate  {
  constructor( private router: Router, private loginService:LoginService){}
  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean | UrlTree | Observable<boolean | UrlTree> | Promise<boolean | UrlTree> {
    return this.loginService.account!.pipe(take(1) ,map(
      admin => {
        if (admin === null) {
          // console.log('user is null', admin)
          // return true;
          this.router.navigate(['unauthorized']);
          return false;
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
