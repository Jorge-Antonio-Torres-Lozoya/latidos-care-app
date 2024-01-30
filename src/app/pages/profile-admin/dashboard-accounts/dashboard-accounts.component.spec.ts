import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DashboardAccountsComponent } from './dashboard-accounts.component';

describe('DashboardAccountsComponent', () => {
  let component: DashboardAccountsComponent;
  let fixture: ComponentFixture<DashboardAccountsComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [DashboardAccountsComponent]
    });
    fixture = TestBed.createComponent(DashboardAccountsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
