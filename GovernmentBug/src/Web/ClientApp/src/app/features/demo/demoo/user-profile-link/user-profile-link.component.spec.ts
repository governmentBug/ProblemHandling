import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UserProfileLinkComponent } from './user-profile-link.component';

describe('UserProfileLinkComponent', () => {
  let component: UserProfileLinkComponent;
  let fixture: ComponentFixture<UserProfileLinkComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [UserProfileLinkComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(UserProfileLinkComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
