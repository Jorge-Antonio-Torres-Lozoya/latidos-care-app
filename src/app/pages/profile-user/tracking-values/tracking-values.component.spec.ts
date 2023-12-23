import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TrackingValuesComponent } from './tracking-values.component';

describe('TrackingValuesComponent', () => {
  let component: TrackingValuesComponent;
  let fixture: ComponentFixture<TrackingValuesComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [TrackingValuesComponent]
    });
    fixture = TestBed.createComponent(TrackingValuesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
