import { ComponentFixture, TestBed } from '@angular/core/testing';

import { VerificationUserComponent } from './verification-user.component';

describe('VerificationUserComponent', () => {
  let component: VerificationUserComponent;
  let fixture: ComponentFixture<VerificationUserComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [VerificationUserComponent]
    });
    fixture = TestBed.createComponent(VerificationUserComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
