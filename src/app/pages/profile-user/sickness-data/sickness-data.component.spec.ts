import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SicknessDataComponent } from './sickness-data.component';

describe('SicknessDataComponent', () => {
  let component: SicknessDataComponent;
  let fixture: ComponentFixture<SicknessDataComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SicknessDataComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SicknessDataComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
