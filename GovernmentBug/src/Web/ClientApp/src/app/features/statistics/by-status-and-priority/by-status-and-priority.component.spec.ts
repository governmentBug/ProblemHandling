import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ByStatusAndPriorityComponent } from './by-status-and-priority.component';

describe('ByStatusAndPriorityComponent', () => {
  let component: ByStatusAndPriorityComponent;
  let fixture: ComponentFixture<ByStatusAndPriorityComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ByStatusAndPriorityComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ByStatusAndPriorityComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
