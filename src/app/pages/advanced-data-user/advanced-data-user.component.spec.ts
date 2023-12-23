import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AdvancedDataUserComponent } from './advanced-data-user.component';

describe('AdvancedDataUserComponent', () => {
  let component: AdvancedDataUserComponent;
  let fixture: ComponentFixture<AdvancedDataUserComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [AdvancedDataUserComponent]
    });
    fixture = TestBed.createComponent(AdvancedDataUserComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
