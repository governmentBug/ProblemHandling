import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AllBugsComponent } from './all-bugs.component';

describe('AllBugsComponent', () => {
  let component: AllBugsComponent;
  let fixture: ComponentFixture<AllBugsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AllBugsComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AllBugsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
