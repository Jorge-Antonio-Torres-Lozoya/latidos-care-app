import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-frequent-questions',
  templateUrl: './frequent-questions.component.html',
  styleUrls: ['./frequent-questions.component.css']
})
export class FrequentQuestionsComponent implements OnInit {
  documento:boolean = true
  consulta:boolean = true
  contratacion:boolean = true
  reunion:boolean = true
  pago:boolean = true
  precio:boolean = true
  comunicacion:boolean = true

  constructor() { }

  ngOnInit(): void {
  }

}
