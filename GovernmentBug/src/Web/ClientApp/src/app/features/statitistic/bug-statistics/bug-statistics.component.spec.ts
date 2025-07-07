import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BugStatisticsComponent } from './bug-statistics.component';

describe('BugStatisticsComponent', () => {
  let component: BugStatisticsComponent;
  let fixture: ComponentFixture<BugStatisticsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [BugStatisticsComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(BugStatisticsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
