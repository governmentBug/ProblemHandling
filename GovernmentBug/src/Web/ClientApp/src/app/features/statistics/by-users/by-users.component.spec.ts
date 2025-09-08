import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ByUsersComponent } from './by-users.component';

describe('ByUsersComponent', () => {
  let component: ByUsersComponent;
  let fixture: ComponentFixture<ByUsersComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ByUsersComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ByUsersComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
