import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SicknessComponent } from './sickness.component';

describe('SicknessComponent', () => {
  let component: SicknessComponent;
  let fixture: ComponentFixture<SicknessComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SicknessComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SicknessComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
