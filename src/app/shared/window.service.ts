import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class WindowService {

  private isMobile = new BehaviorSubject<boolean>(false);

  constructor() {
    this.checkScreenSize();
    window.addEventListener('resize', this.checkScreenSize.bind(this));
  }

  get isMobile$() {
    return this.isMobile.asObservable();
  }

  private checkScreenSize() {
    this.isMobile.next(window.innerWidth < 768);
  }
}
