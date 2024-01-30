import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DashboardTrackingValuesComponent } from './dashboard-tracking-values.component';

describe('DashboardTrackingValuesComponent', () => {
  let component: DashboardTrackingValuesComponent;
  let fixture: ComponentFixture<DashboardTrackingValuesComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [DashboardTrackingValuesComponent]
    });
    fixture = TestBed.createComponent(DashboardTrackingValuesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
