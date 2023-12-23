import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-terms-conditions',
  templateUrl: './terms-conditions.component.html',
  styleUrls: ['./terms-conditions.component.css']
})
export class TermsConditionsComponent implements OnInit {
  logo = '../../../assets/images/logo-healthtech.svg';
  navItems = [
    {
      content: 'Nosotros',
      routerLink: `/#about`,
      clickFunction: () => this.forceNavigate('about')
    },
    {
      content: 'Nuestro Servicios',
      routerLink: `/#services`,
      clickFunction: () => this.forceNavigate('services')
    },
    {
      content: 'Preguntas frecuentes',
      routerLink: '/#frequent-questions',
      clickFunction: () => this.forceNavigate('frequent-questions')
    },
    {
      content: 'Iniciar Sesion',
      routerLink: '/login',
    },
    {
      content: 'Registrarme',
      routerLink: '/register-user',
    }
  ];

  constructor(private router: Router) { }

  ngOnInit(): void {
  }

  forceNavigate(name: string) {
    this.router.navigate(['/'], { fragment: name });
  }

}
