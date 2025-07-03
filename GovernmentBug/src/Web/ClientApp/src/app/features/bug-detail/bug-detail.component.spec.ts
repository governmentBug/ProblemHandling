import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BugDetailComponent } from './BugDetailComponent';

describe('BugDetailComponent', () => {
  let component: BugDetailComponent;
  let fixture: ComponentFixture<BugDetailComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [BugDetailComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(BugDetailComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
