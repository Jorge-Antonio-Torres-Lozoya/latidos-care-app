import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DataPacientComponent } from './data-pacient.component';

describe('DataPacientComponent', () => {
  let component: DataPacientComponent;
  let fixture: ComponentFixture<DataPacientComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [DataPacientComponent]
    });
    fixture = TestBed.createComponent(DataPacientComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
