import { ComponentFixture, TestBed } from '@angular/core/testing';

import { OpenBugsByStatusComponent } from './open-bugs-stat.component';

describe('OpenBugsByStatusComponent', () => {
  let component: OpenBugsByStatusComponent;
  let fixture: ComponentFixture<OpenBugsByStatusComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [OpenBugsByStatusComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(OpenBugsByStatusComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
