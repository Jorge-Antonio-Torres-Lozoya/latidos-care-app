import { Component, Input, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css']
})
export class NavbarComponent implements OnInit {
  @Input() logoSrc: string = '';
  @Input() navItems?: NavItem[] = [];

  collapsed: boolean = true;

  constructor(private router: Router) { }

  ngOnInit(): void {
  }

  navigateToHome() {
    this.router.navigateByUrl(`/`);
  }
}

export interface NavItem {
  content: string;
  routerLink?: string;
  clickFunction?: () => void;
}

