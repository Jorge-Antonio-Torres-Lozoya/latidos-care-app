import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AdvancedDataSicknessComponent } from './advanced-data-sickness.component';

describe('AdvancedDataSicknessComponent', () => {
  let component: AdvancedDataSicknessComponent;
  let fixture: ComponentFixture<AdvancedDataSicknessComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [AdvancedDataSicknessComponent]
    });
    fixture = TestBed.createComponent(AdvancedDataSicknessComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
