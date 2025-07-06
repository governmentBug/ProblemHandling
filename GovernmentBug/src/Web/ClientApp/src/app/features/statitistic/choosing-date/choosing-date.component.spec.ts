import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ChoosingYearComponent } from './choosing-date.component';

describe('ChoosingYearComponent', () => {
  let component: ChoosingYearComponent;
  let fixture: ComponentFixture<ChoosingYearComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ChoosingYearComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ChoosingYearComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
