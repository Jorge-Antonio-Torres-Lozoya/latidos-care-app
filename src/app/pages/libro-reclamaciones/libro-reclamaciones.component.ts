import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-libro-reclamaciones',
  templateUrl: './libro-reclamaciones.component.html',
  styleUrls: ['./libro-reclamaciones.component.css']
})
export class LibroReclamacionesComponent implements OnInit {

  constructor(private router: Router) { }

  ngOnInit(): void {
  }

}
