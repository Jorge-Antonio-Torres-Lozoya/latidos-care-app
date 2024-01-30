import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DashboardAllergiesComponent } from './dashboard-allergies.component';

describe('DashboardAllergiesComponent', () => {
  let component: DashboardAllergiesComponent;
  let fixture: ComponentFixture<DashboardAllergiesComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [DashboardAllergiesComponent]
    });
    fixture = TestBed.createComponent(DashboardAllergiesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
