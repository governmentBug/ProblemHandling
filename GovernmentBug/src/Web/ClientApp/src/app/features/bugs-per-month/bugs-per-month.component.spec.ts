import { ComponentFixture, TestBed } from '@angular/core/testing';
import { BugsPerMonthComponent } from './bugs-per-month.component';

describe('BugsPerMonthComponent', () => {
  let component: BugsPerMonthComponent;
  let fixture: ComponentFixture<BugsPerMonthComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [BugsPerMonthComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(BugsPerMonthComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
