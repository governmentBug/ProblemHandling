import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NewBugComponent } from './new-bug.component';

describe('NewBugComponent', () => {
  let component: NewBugComponent;
  let fixture: ComponentFixture<NewBugComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [NewBugComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(NewBugComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
