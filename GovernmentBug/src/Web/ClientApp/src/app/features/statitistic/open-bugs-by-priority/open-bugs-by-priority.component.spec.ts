import { ComponentFixture, TestBed } from '@angular/core/testing';

import { OpenBugsByPriorityComponent } from './open-bugs-by-priority.component';

describe('OpenBugsByPriorityComponent', () => {
  let component: OpenBugsByPriorityComponent;
  let fixture: ComponentFixture<OpenBugsByPriorityComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [OpenBugsByPriorityComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(OpenBugsByPriorityComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
