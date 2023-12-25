// qr-access.guard.ts
import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, Router } from '@angular/router';


@Injectable({
  providedIn: 'root'
})
export class QrAccessGuard implements CanActivate {

  constructor(private router: Router) {}

  canActivate(route: ActivatedRouteSnapshot): boolean {
    const token = route.queryParams['token'];

    if (!token) {
      console.log('no validado')
      this.router.navigate(['unauthorized']);
      return false;
    }
    console.log('validado')
    return true;
  }
}
