import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MonthlyTrendsComponent } from './monthly-trends.component';

describe('MonthlyTrendsComponent', () => {
  let component: MonthlyTrendsComponent;
  let fixture: ComponentFixture<MonthlyTrendsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MonthlyTrendsComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MonthlyTrendsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
