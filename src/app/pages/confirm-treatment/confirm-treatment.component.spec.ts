import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ConfirmTreatmentComponent } from './confirm-treatment.component';

describe('ConfirmTreatmentComponent', () => {
  let component: ConfirmTreatmentComponent;
  let fixture: ComponentFixture<ConfirmTreatmentComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ConfirmTreatmentComponent]
    });
    fixture = TestBed.createComponent(ConfirmTreatmentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
