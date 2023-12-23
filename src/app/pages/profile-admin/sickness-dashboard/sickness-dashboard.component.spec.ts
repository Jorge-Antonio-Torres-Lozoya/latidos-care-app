import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SicknessDashboardComponent } from './sickness-dashboard.component';

describe('SicknessDashboardComponent', () => {
  let component: SicknessDashboardComponent;
  let fixture: ComponentFixture<SicknessDashboardComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SicknessDashboardComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SicknessDashboardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
