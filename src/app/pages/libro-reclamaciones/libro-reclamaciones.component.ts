import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-libro-reclamaciones',
  templateUrl: './libro-reclamaciones.component.html',
  styleUrls: ['./libro-reclamaciones.component.css']
})
export class LibroReclamacionesComponent implements OnInit {
  logo = '../../../assets/images/logo-color-svg.svg';
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
