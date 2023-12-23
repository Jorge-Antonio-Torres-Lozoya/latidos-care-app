import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css']
})
export class NavbarComponent implements OnInit {
  @Input() logoSrc: string = '';
  @Input() navItems?: NavItem[] = [];

  collapsed: boolean = true;

  constructor() { }

  ngOnInit(): void {
  }
}

export interface NavItem {
  content: string;
  routerLink?: string;
  clickFunction?: () => void;
}

