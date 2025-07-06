import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TotalOpenBugsComponent } from './total-open-bugs.component';

describe('TotalOpenBugsComponent', () => {
  let component: TotalOpenBugsComponent;
  let fixture: ComponentFixture<TotalOpenBugsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TotalOpenBugsComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TotalOpenBugsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
