import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SicknessFormComponent } from './sickness-form.component';

describe('SicknessFormComponent', () => {
  let component: SicknessFormComponent;
  let fixture: ComponentFixture<SicknessFormComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SicknessFormComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SicknessFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
