import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RecoverPasswordUserComponent } from './recover-password-user.component';

describe('RecoverPasswordUserComponent', () => {
  let component: RecoverPasswordUserComponent;
  let fixture: ComponentFixture<RecoverPasswordUserComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [RecoverPasswordUserComponent]
    });
    fixture = TestBed.createComponent(RecoverPasswordUserComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
