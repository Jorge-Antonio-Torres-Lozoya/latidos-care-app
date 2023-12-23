import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot, UrlTree } from '@angular/router';
import { Observable, first, map, take } from 'rxjs';
import { LoginUserService } from '../../pages/login-user/login-user.service';

@Injectable({
  providedIn: 'root'
})
export class UserGuard implements CanActivate {
  constructor(private router: Router, private loginUserService: LoginUserService) {}

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<boolean> {
    return this.loginUserService.user!.pipe(take(1) ,map(user => {
      if (user === null) {
        console.log('user is null', user)
        return true; // Allow navigation, but you might want to show a loading spinner or something similar
      }
        const isAuthorized = !!user;
        if (isAuthorized) {
          return true;
        } else {
          this.router.navigate(['unauthorized']);
          return false;
        }
      })
    );
  }
}
