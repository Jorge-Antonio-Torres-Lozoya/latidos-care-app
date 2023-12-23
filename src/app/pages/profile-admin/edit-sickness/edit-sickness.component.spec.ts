import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EditSicknessComponent } from './edit-sickness.component';

describe('EditSicknessComponent', () => {
  let component: EditSicknessComponent;
  let fixture: ComponentFixture<EditSicknessComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ EditSicknessComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(EditSicknessComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
